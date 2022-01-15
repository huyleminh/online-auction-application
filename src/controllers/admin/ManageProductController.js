import moment from "moment";
import AuthMiddlewares from "../../middlewares/AuthMiddlewares.js";
import AutoBiddingJobModel from "../../models/AutoBiddingJobModel.js";
import BiddingHistoryModel from "../../models/BiddingHistoryModel.js";
import JoinBidderModel from "../../models/JoinBidderModel.js";
import ProductDetailModel from "../../models/ProductDetailModel.js";
import ProductModel from "../../models/ProductModal.js";
import UserAccountModel from "../../models/UserAccountModel.js";
import WishlistModel from "../../models/WishlistModel.js";
import EmailService from "../../services/EmailService.js";
import EmailTemplate from "../../shared/template/EmailTemplate.js";
import AppController from "../AppController.js";

export default class ManageProductController extends AppController {
    constructor() {
        super();

        this.init();
    }

    init() {
        this._router.get(
            "/admin/products",
            AuthMiddlewares.authorizeAdmin,
            this.renderProductManagement
        );

        this._router.post(
            "/admin/products/delete",
            AuthMiddlewares.authorizeAdmin,
            this.deleteProduct
        );
    }

    async renderProductManagement(req, res) {
        let { page } = req.query;

        page = page ? parseInt(page) : 1;

        if (isNaN(page) || page < 1) {
            return res.redirect(`/admin/products?page=${1}`);
        }

        try {
            const user = await UserAccountModel.getByColumn("username", req.user.username);
            if (user === undefined) {
                req.logout();
                return req.session.save(() => {
                    res.redirect("/login");
                });
            }

            const data = await ProductModel.getAllWithPagination(page);

            let promises = data.data.map((element) => {
                return UserAccountModel.getSellerByProductId(element.product_id);
            });

            const additionalInfo = await Promise.all(promises);

            const result = data.data.map((element, index) => {
                element.seller_name =
                    additionalInfo[index][0].first_name + " " + additionalInfo[index][0].last_name;
                element.is_sold =
                    element.is_sold === 0
                        ? moment(element.expired_date).isAfter(moment())
                            ? 0
                            : 2
                        : element.is_sold;
                return element;
            });

            if (data === undefined || data.data.length === 0) {
                return res.render("pages/admin/product-list", {
                    layout: "admin",
                    data: {
                        list: [],
                        hasNext: false,
                        page: 1,
                    },
                });
            }

            return res.render("pages/admin/product-list", {
                layout: "admin",
                data: {
                    list: result,
                    hasNext: data.hasNext,
                    page,
                },
            });
        } catch (err) {
            console.log(err);
            return res.render("pages/admin/product-list", {
                layout: "admin",
                data: {
                    list: [],
                    hasNext: false,
                    page: 1,
                },
            });
        }
    }

    async deleteProduct(req, res) {
        const { body } = req;
        const id = body ? parseInt(body.id) : null;
        if (id === null || isNaN(id)) {
            return res.redirect(`/admin/products`);
        }

        try {
            const user = await UserAccountModel.getByColumn("username", req.user.username);
            if (user === undefined) {
                req.logout();
                return req.session.save(() => {
                    res.redirect("/login");
                });
            }

            const product = await ProductModel.getById(id);
            if (product === undefined || product.length === 0) {
                return res.redirect(`/admin/products`);
            }
            const seller = await UserAccountModel.getSellerByProductId(id);
            const promises = [
                JoinBidderModel.deleteWithProductId(id),
                WishlistModel.deleteWithProductId(id),
                BiddingHistoryModel.deleteWithProductId(id),
                ProductDetailModel.deleteWithProductId(id),
                AutoBiddingJobModel.deleteWithProductId(id),
            ];
            await Promise.all(promises);
            await ProductModel.deleteWithProductId(id);

            await EmailService.sendEmailWithHTMLContent(
                seller[0].email,
                "Bidding inform - Your product has been deleted by the administrator",
                EmailTemplate.productHasBeenDeletedByAdmin(product[0].product_name, user[0].email)
            );

            return res.redirect(`/admin/products`);
        } catch (err) {
            console.log(err);
            return res.redirect(`/admin/products`);
        }
    }
}
