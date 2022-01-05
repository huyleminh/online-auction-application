import moment from "moment";
import numeral from "numeral";
import CategoryModel from "../../models/CategoryModel.js";
import ProductModel from "../../models/ProductModal.js";
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

            const productListMap = sortProductUtil(productList[0], sort).map((item) => {
                const createdDate = moment(item.created_date).locale("en").fromNow();
                const minDiff = -1 * moment().diff(moment(item.expired_date), "minutes");

                const retObj = {
                    productId: item.product_id,
                    productName: item.product_name,
                    thumbnail: item.thumbnail,
                    currentPrice: numeral(item.current_price).format("0,0"),
                    buyNowPrice:
                        item.buy_now_price !== null
                            ? numeral(item.buy_now_price).format("0,0")
                            : "N/A",
                    totalBids: item.bid_count,
                    expiredDate: item.expired_date,
                    firstName: item.first_name,
                    createdDate,
                    isNew: minDiff <= 30,
                };

                return retObj;
            });

            const total = totalRows[0].total ? totalRows[0].total : 0;
            const pageList = Array.from(
                { length: Math.floor(total / DEFAULT_PAGE_SIZE) + 1 },
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

    renderProductDetail(req, res) {
        const { productId } = req.params;
        console.log({ productId });

        // Get product detail here

        res.render("pages/products/detail", {
            productId,
            relatedProducts: [1, 2, 3, 4, 5],
        });
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
}

function sortProductUtil(productList, sortType) {
    const sorted = productList.sort((left, right) => {
        switch (sortType) {
            case "price_asc":
                return left.current_price - right.current_price;
            case "price_desc":
                return right.current_price - left.current_price;
            case "time_asc":
                return moment(left.expired_date).diff(moment(right.expired_date));
            case "time_asc":
                return moment(right.expired_date).diff(moment(left.expired_date));
            default:
                return left.current_price - right.current_price;
        }
    });

    return sorted;
}
