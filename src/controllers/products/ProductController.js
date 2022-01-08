import moment from "moment";
import numeral from "numeral";
import AuthMiddlewares from "../../middlewares/AuthMiddlewares.js";
import AutoBiddingJobModel from "../../models/AutoBiddingJobModel.js";
import BiddingHistoryModel from "../../models/BiddingHistoryModel.js";
import CategoryModel from "../../models/CategoryModel.js";
import JoinBidderModel from "../../models/JoinBidderModel.js";
import ProductDetailModel from "../../models/ProductDetailModel.js";
import ProductModel from "../../models/ProductModal.js";
import UserAccountModel from "../../models/UserAccountModel.js";
import EmailService from "../../services/EmailService.js";
import CommomCont from "../../shared/CommonConst.js";
import EmailTemplate from "../../shared/template/EmailTemplate.js";
import CommomUtils from "../../utils/CommonUtils.js";
import { ScheduleJobEventInstance } from "../../utils/ScheduleJobEvent.js";
import AppController from "../AppController.js";

const DEFAULT_PAGE_SIZE = 12;

export default class ProductController extends AppController {
    constructor() {
        super();
        this.init();
    }

    init() {
        this._router.get("/menu/categories/:catId", this.renderProductList);
        this._router.get("/menu/products/:productId", this.renderProductDetail);
        this._router.post(
            "/menu/products/:productId",
            AuthMiddlewares.authorizeUser,
            this.postHitBidProduct
        );

        this._router.get("/api/menu/categories", this.getFilterCategories);
    }

    async renderProductList(req, res) {
        let { catId } = req.params;
        let { page, search, sort, type } = req.query;

        if (!page) {
            page = 1;
        } else {
            page = parseInt(page);
        }

        sort = sort ? sort : "price_asc";

        try {
            let productList;
            let totalRows;

            if (search !== undefined) {
                // Search with keyword
                if (type === "all") {
                    productList = await ProductModel.getAllWithKeyWord(
                        search,
                        DEFAULT_PAGE_SIZE,
                        DEFAULT_PAGE_SIZE * (page - 1)
                    );
                }
                if (type === "prod") {
                    productList = await ProductModel.getAllWithKeyWordProd(
                        search,
                        DEFAULT_PAGE_SIZE,
                        DEFAULT_PAGE_SIZE * (page - 1)
                    );
                }

                if (type === "cat") {
                    productList = await ProductModel.getAllWithKeyWordCat(
                        search,
                        DEFAULT_PAGE_SIZE,
                        DEFAULT_PAGE_SIZE * (page - 1)
                    );
                }

                totalRows = [{ total: productList[0].length }];
            }

            if (search === undefined && catId !== "all" && parseInt(catId) > 0) {
                productList = await ProductModel.getAllWithCatId(
                    parseInt(catId),
                    DEFAULT_PAGE_SIZE,
                    DEFAULT_PAGE_SIZE * (page - 1)
                );
                totalRows = await ProductModel.countTotalProductByCat(catId);
            }

            if (search === undefined && catId === "all") {
                productList = await ProductModel.getAllWithAllCat(
                    DEFAULT_PAGE_SIZE,
                    DEFAULT_PAGE_SIZE * (page - 1)
                );
                totalRows = await ProductModel.countTotalProductByCat(catId);
            }

            const productListMap = CommomUtils.sortProductUtil(productList[0], sort).map((item) => {
                const createdDate = moment(item.created_date).locale("en").fromNow();
                const minDiff = -1 * moment().diff(moment(item.expired_date), "minutes");

                const retObj = {
                    productId: item.product_id,
                    productName: item.product_name,
                    thumbnail: item.thumbnail,
                    currentPrice: item.current_price,
                    buyNowPrice:
                        item.buy_now_price !== null
                            ? numeral(item.buy_now_price).format("0,0")
                            : "N/A",
                    totalBids: item.bid_count,
                    expiredDate: item.expired_date,
                    firstName: item.first_name,
                    createdDate,
                    isNew: minDiff <= 30,
                    isSold: item.is_sold,
                };

                return retObj;
            });

            const total = totalRows[0].total ? totalRows[0].total : 0;
            const pageList = Array.from(
                { length: total % DEFAULT_PAGE_SIZE === 0 ? total / DEFAULT_PAGE_SIZE : Math.floor(total / DEFAULT_PAGE_SIZE) + 1 },
                (_, i) => {
                    return { key: i + 1, isActive: i + 1 === page };
                }
            );

            return res.render("pages/products/index", {
                data: {
                    productList: productListMap,
                    totalResult: productListMap.length,
                    totalRows: total,
                    pageList,
                    sort,
                    page,
                },
            });
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async renderProductDetail(req, res) {
        const { productId } = req.params;
        const [message] = req.flash("message");
        const [type] = req.flash("type");

        try {
            const [[product], [detail]] = await Promise.all([
                ProductModel.getById(productId),
                ProductDetailModel.getlById(productId),
            ]);

            if (!product || !detail) {
                return res.render("pages/products/detail", {
                    data: {
                        notFound: true,
                    },
                });
            }

            const userList = await UserAccountModel.getWithIdList([
                detail.seller_id,
                product.won_bidder_id,
            ]);
            const bidder = userList.filter((user) => user.user_id === product.won_bidder_id)[0];
            const seller = userList.filter((user) => user.user_id === detail.seller_id)[0];

            const retObj = {
                ...product,
                ...detail,
                image_links: JSON.parse(detail.image_links),
                created_date: moment(product.created_date).locale("en").fromNow(),
                bidder: bidder ? {
                    name: bidder.first_name,
                    point: bidder.rating_point,
                } : null,
                seller: {
                    name: `${seller.first_name} ${seller.last_name}`,
                    point: seller.rating_point,
                },
                canBuyNow: product.buy_now_price !== null ? true : false,
            };

            delete retObj.max_tolerable_price;
            delete retObj.won_bidder_id;
            delete retObj.cat_id;
            delete retObj.auto_extend;
            delete retObj.seller_id;

            const [relatedProducts] = await ProductModel.getRandomProductByCatId(
                productId,
                product.cat_id,
                5
            );

            const mappedRelated = relatedProducts.map((item) => {
                const createdDate = moment(item.created_date).locale("en").fromNow();

                const ret = {
                    productId: item.product_id,
                    productName: item.product_name,
                    thumbnail: item.thumbnail,
                    currentPrice: item.current_price,
                    totalBids: item.bid_count !== null ? item.bid_count : 0,
                    createdDate,
                    expiredDate: item.expired_date,
                    firstName: item.first_name ? item.first_name : null,
                    isSold: item.is_sold,
                };

                if (item.buy_now_price !== null) {
                    ret.buyNowPrice = numeral(item.buy_now_price).format("0,0");
                }

                return ret;
            });

            let mappedHistory = [];
            if (req.user && req.user.isAuth) {
                const history = await BiddingHistoryModel.getHistoryByProductId(productId);
                mappedHistory = history.map((h) => {
                    const retObj = {
                        bidder_fname: h.bidder_fname,
                        current_price: h.current_price,
                        bid_date: moment(h.bid_date).format(CommomCont.MOMENT_BASE_USER_FORMAT),
                    };
                    return retObj;
                });
            }

            return res.render("pages/products/detail", {
                data: {
                    productDetail: retObj,
                    related: mappedRelated,
                    history: mappedHistory,
                },
                msg: { message, type },
            });
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async getFilterCategories(req, res) {
        try {
            const rootPromise = CategoryModel.getAll();
            const childPromise = CategoryModel.getAllChild();

            const resultSet = await Promise.all([rootPromise, childPromise]);

            const mappedCat = resultSet[0].map((item) => {
                const children = resultSet[1].filter((child) => child.super_cat_id === item.cat_id);
                return {
                    rootName: item.cat_name,
                    children,
                };
            });
            res.json({ status: 200, data: mappedCat });
        } catch (error) {
            console.log(error);
            res.json({ status: 500 });
        }
    }

    async postHitBidProduct(req, res) {
        const { body, user } = req;
        try {
            // Find if product is available
            const [product] = await ProductModel.getById(body.productId);
            console.log({ product });
            if (!product) {
                return res.redirect(`/menu/products/${body.productId}`);
            }

            // Redirect if sold or expired
            if (product.is_sold || moment().isSame(moment(product.expired_date))) {
                req.flash("message", "This product has been sold or expired");
                req.flash("type", "warning");
                return res.redirect(`/menu/products/${body.productId}`);
            }

            // Get user id
            const [userFromDb] = await UserAccountModel.getByColumn("username", user.username);
            console.log({ userFromDb });
            if (!userFromDb) {
                req.logout();
                delete req.session.wishlist;
                return req.session.save(() => {
                    res.redirect("/login");
                });
            }

            // Redirect if user cannot bid with current rating point
            if (!product.is_allow_all && userFromDb.rating_point <= 80) {
                req.flash("message", "Your point is not high enough to join bidding this product");
                req.flash("type", "danger");
                return res.redirect(`/menu/products/${body.productId}`);
            }

            // Validate is banned
            const [banResult] = await JoinBidderModel.getJoinBidderWithProduct(
                userFromDb.user_id,
                body.productId
            );
            console.log({ banResult });
            if (banResult && banResult.is_banned) {
                req.flash("message", "You are banned by the seller in bidding this product");
                req.flash("type", "danger");
                return res.redirect(`/menu/products/${body.productId}`);
            }

            // Start bidding
            const [detail] = await ProductDetailModel.getlById(product.product_id);
            console.log({ detail });

            // Check input price
            // Greater than or equal buy now price
            if (parseInt(body.money) >= product.buy_now_price) {
                console.log("Buy now");

                await BiddingHistoryModel.insert({
                    product_id: product.product_id,
                    bidder_id: userFromDb.user_id,
                    current_price: product.buy_now_price,
                    bidder_fname: userFromDb.first_name,
                    tolerable_price: parseInt(body.money),
                });

                await ProductModel.update(product.product_id, {
                    current_price: product.buy_now_price,
                    max_tolerable_price: parseInt(body.money),
                    is_sold: 1,
                    won_bidder_id: userFromDb.user_id,
                });

                // Update job
                const [job] = await AutoBiddingJobModel.getByProductId(product.product_id);
                console.log({ job });
                ScheduleJobEventInstance.reScheduleJob(
                    job.job_id,
                    moment().add(10, "seconds").toDate()
                );

                req.flash("message", "Buy product successfully");
                req.flash("type", "success");
                return res.redirect(`/menu/products/${body.productId}`);
            }

            // Price must be higher than old price
            const [userBidHistory] = await BiddingHistoryModel.getTolerablePriceAndBidDate(
                userFromDb.user_id,
                product.product_id
            );
            console.log({ userBidHistory });
            if (userBidHistory && userBidHistory.tolerable_price >= parseInt(body.money)) {
                req.flash("message", "You have bidded with higher price for this product");
                req.flash("type", "warning");
                return res.redirect(`/menu/products/${body.productId}`);
            }

            if (parseInt(body.money) <= product.max_tolerable_price) {
                console.log("Lower - Equal");
                await BiddingHistoryModel.insert({
                    product_id: product.product_id,
                    bidder_id: userFromDb.user_id,
                    current_price: parseInt(body.money),
                    bidder_fname: userFromDb.first_name,
                    tolerable_price: parseInt(body.money),
                });

                await ProductModel.update(product.product_id, {
                    current_price: parseInt(body.money),
                });
            } else {
                console.log("Higher");
                await BiddingHistoryModel.insert({
                    product_id: product.product_id,
                    bidder_id: userFromDb.user_id,
                    current_price: product.max_tolerable_price + detail.step_price,
                    bidder_fname: userFromDb.first_name,
                    tolerable_price: parseInt(body.money),
                });

                const tempId = product.won_bidder_id;
                await ProductModel.update(product.product_id, {
                    current_price: product.max_tolerable_price + detail.step_price,
                    max_tolerable_price: parseInt(body.money),
                    won_bidder_id: userFromDb.user_id,
                });

                // Send email to temp winner
                if (tempId !== userFromDb.user_id) {
                    UserAccountModel.getByColumn("user_id", tempId).then((res) => {
                        const [winner] = res;
                        if (winner) {
                            EmailService.sendEmailWithHTMLContent(
                                winner.email,
                                "Bidding progress - Your max tolerable price has been passed",
                                EmailTemplate.biddingPriceWarningBidder()
                            ).catch((error) => {
                                console.log(error);
                            });
                        }
                    });
                }
            }

            // Check expired date to update job and expired date
            if (detail.auto_extend) {
                const minDiff = moment().diff(moment(product.expired_date), "minutes");
                if (Math.abs(minDiff) <= 5) {
                    const newExpiredDate = moment(product.expired_date).add(10, "minutes");
                    console.log({ newExpiredDate });
                    await ProductModel.update(product.product_id, {
                        expired_date: newExpiredDate.format(CommomCont.MOMENT_BASE_DB_FORMAT),
                    });

                    // Update job
                    const [job] = await AutoBiddingJobModel.getByProductId(product.product_id);
                    console.log({ job });
                    ScheduleJobEventInstance.reScheduleJob(
                        job.job_id,
                        newExpiredDate.toDate()
                    );
                }
            }

            req.flash("message", "Hit a price successfully");
            req.flash("type", "success");
            return res.redirect(`/menu/products/${body.productId}`);
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
}
