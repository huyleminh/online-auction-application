import AuthMiddlewares from "../../middlewares/AuthMiddlewares.js";
import { ImageDiskUpload } from "../../middlewares/MulterUpload.js";
import AppController from "../AppController.js";
import FirebaseService from "../../services/FirsebaseService.js"
import CategoryModel from "../../models/CategoryModel.js";
import UserAccountModel from "../../models/UserAccountModel.js";
import ProductModel from "../../models/ProductModal.js";
import moment from 'moment';
import CommonConst from "../../shared/CommonConst.js";

export default class SellerController extends AppController {
    constructor() {
        super();
        this.init();
    }

    init() {
        this._router.get(
            "/seller/products/create",
            AuthMiddlewares.authorizeUser,
            this.createProductPage
        );

        this._router.post(
            "/seller/products/create",
            AuthMiddlewares.authorizeUser,
            ImageDiskUpload.fields([{name: 'thumbnailImg'},{name: 'detailImages'}]),
            this.postCreateNewProduct
        );

        this._router.get(
            "/seller/products",
            AuthMiddlewares.authorizeUser,
            this.manageSellingProduct
        );

        this._router.get(
            "/seller/products/:productId",
            AuthMiddlewares.authorizeUser,
            this.renderEditProduct
        );

        this._router.post(
            "/seller/products/edit",
            AuthMiddlewares.authorizeUser,
            this.editProduct
        );

        this._router.post(
            "/seller/products/upload",
            ImageDiskUpload.single("upload"),
            this.uploadProductImage
        );
    }

    async createProductPage(req, res) {
        let catList = await CategoryModel.getAllChild();

        res.render("pages/user/seller/create-product", {
            layout: "profile",
            data: catList
        });
    }

    async postCreateNewProduct(req, res) {
        const { body } = req;
        const thumbnail = req.files.thumbnailImg[0];
        const detailImages = req.files.detailImages;
        try {
            const user = await UserAccountModel.getByColumn("username", req.user.username);
            if (user === undefined) {
                req.logout();
                return req.session.save(() => {
                    res.redirect("/login");
                });
            }

            const { seller_expired_date } = user[0];
            if (seller_expired_date && moment(seller_expired_date).isAfter(moment())) {
                // Is Seller
                // return res.render("pages/user/bidder/upgrade", {
                //     layout: "profile",
                //     data: {
                //         isSeller: true,
                //         sellerExpiredDate: moment(seller_expired_date).format(
                //             CommonConst.MOMENT_BASE_USER_FORMAT
                //         ),
                //     },
                // });
                const product = {};
                const detail = {};

                product.product_name = body.prodName;
                product.cat_id = body.prodCategory;
                product.current_price = parseInt(body.startPrice);
                product.expired_date = moment(`${body.expiredDate} ${body.expiredTime}`, "DD/MM/YYYY HH:mm:ss").format(CommonConst.MOMENT_BASE_DB_FORMAT);
                product.is_allow_all = body.allowAll === 'on' ? true : false;
                product.buy_now_price = body.buynowPrice.length === 0 ? null : parseInt(body.buynowPrice);
                product.is_sold = false;

                detail.step_price = parseInt(body.stepPrice);
                detail.auto_extend = body.autoExtend === 'on' ? true : false;
                detail.seller_id = user[0].user_id;
                detail.description = body.description;

                let uploadedThumbnail = FirebaseService.uploadSingleImage(thumbnail.path, thumbnail.mimetype.split('/')[1]);
                let uploadedDetailImages = detailImages.map((element) => {
                    return FirebaseService.uploadSingleImage(element.path, element.mimetype.split('/')[1]);
                })

                let promises = [uploadedThumbnail, ...uploadedDetailImages];

                const uploadedImages = await Promise.all(promises);
                let detailImagesString = '[';
                for (let i = 0; i < uploadedImages.length; i++) {
                    if (i === 0) {
                        product.thumbnail = uploadedImages[i];
                    } else {
                        detailImagesString += `\"${uploadedImages[i]}\"`;
                        if (i !== uploadedImages.length - 1) {
                            detailImagesString += ',';
                        }
                    }
                }
                detailImagesString += ']';
                detail.image_links = detailImagesString;

                await ProductModel.insertAProduct(product, detail);

                // Create auto_bidding_job
                // await ScheduleJobEventInstance.subscribeNewJob(jobId, moment(product.expired_date).toDate())

                res.redirect("/seller/products");
            } else {
                res.redirect("/403");
            }
        } catch (err) {
            console.log(err);
        }

    }

    async uploadProductImage(req, res) {
        const file = req.file;
        const path = file.path;
        const type = file.mimetype.split('/')[1];
        try {
            let temp = await FirebaseService.uploadSingleImage(path, type);
            res.send({ url: temp });
        } catch (err) {
            console.log(err);
        }
    }

    async manageSellingProduct(req, res) {
        let { page } = req.query;

        page = page ? parseInt(page) : 1;

        if (isNaN(page)) {
            return res.redirect(`/user/wishlist?page=1`);
        }

        try {
            const user = await UserAccountModel.getByColumn("username", req.user.username);
            if (user === undefined) {
                req.logout();
                return req.session.save(() => {
                    res.redirect("/login");
                });
            }

            let data = await ProductModel.getSellingProductsByUserId(user[0].user_id, page);

            if (data === undefined || data.data.length === 0) {
                return res.render("pages/user/seller/manage-selling", {
                    layout: "profile",
                    data: {
                        list: [],
                        hasNext: false,
                        page: 1
                    }
                });
            }

            return res.render("pages/user/seller/manage-selling", {
                layout: "profile",
                data: {
                    list: data.data,
                    hasNext: data.hasNext,
                    page
                }
            });
        } catch (err) {
            console.log(err);
            return res.render("pages/user/seller/manage-selling", {
                layout: "profile",
                data: {
                    list: [],
                    hasNext: false,
                    page: 1
                }
            });
        }

    }

    renderEditProduct(req, res) {
        res.redirect('/');
    }

    editProduct(req, res) {
        res.redirect('/');
    }
}
