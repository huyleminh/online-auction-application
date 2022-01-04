import moment from "moment";
import AuthMiddlewares from "../../middlewares/AuthMiddlewares.js";
import UpgradeRequestModel from "../../models/UpgradeRequestModel.js";
import UserAccountModel from "../../models/UserAccountModel.js";
import EmailService from "../../services/EmailService.js";
import CommonConst from "../../shared/CommonConst.js";
import EmailTemplate from "../../shared/template/EmailTemplate.js";
import AppController from "../AppController.js";

export default class ManageUserController extends AppController {
    constructor() {
        super();

        this.init();
    }

    init() {
        this._router.get(
            "/admin/bidders/upgrade",
            AuthMiddlewares.authorizeAdmin,
            this.upgradePage
        );
        this._router.post(
            "/admin/bidders/upgrade/accept",
            AuthMiddlewares.authorizeAdmin,
            this.postAcceptBidder
        );
        this._router.post(
            "/admin/bidders/upgrade/deny",
            AuthMiddlewares.authorizeAdmin,
            this.postDenyBidder
        );

        this._router.get(
            "/admin/sellers",
            //  AuthMiddlewares.authorizeAdmin,
            this.sellerPage
        );
        this._router.post("/admin/sellers", AuthMiddlewares.authorizeAdmin, this.downgradeSeller);

        this._router.get("/admin", AuthMiddlewares.authorizeAdmin, this.adminDashboard);
    }

    async upgradePage(req, res) {
        // Load request and user from db
        try {
            const requestList = await UpgradeRequestModel.getAll();

            if (requestList.length === 0) {
                return res.render("pages/admin/upgrade-list", {
                    layout: "admin",
                    data: {
                        userList: [],
                    },
                });
            }

            const idList = requestList.map((r) => r.user_id);
            const userInfoList = await UserAccountModel.getWithIdList(idList);

            const userList = userInfoList.map((user, index) => {
                const idIndex = requestList.findIndex((id) => id.user_id === user.user_id);
                return {
                    index: index + 1,
                    userId: user.user_id,
                    fullname: `${user.first_name} ${user.last_name}`,
                    email: user.email,
                    ratingPoint: user.rating_point !== null ? user.rating_point : 0,
                    requestedAt:
                        requestList[idIndex].requested_at &&
                        moment(requestList[idIndex].requested_at).format(
                            CommonConst.MOMENT_BASE_USER_FORMAT
                        ),
                };
            });

            return res.render("pages/admin/upgrade-list", {
                layout: "admin",
                data: {
                    userList,
                },
            });
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async postAcceptBidder(req, res) {
        const { bidderId } = req.body;

        try {
            const [user] = await UserAccountModel.getByColumn("user_id", bidderId);
            if (user === undefined) {
                return res.redirect("/admin/bidders/upgrade");
            }
            // Update seller expired date in user table
            const expiredDate = moment().add(7, "days");

            await UserAccountModel.updateColumnById(
                bidderId,
                "seller_expired_date",
                expiredDate.format(CommonConst.MOMENT_BASE_DB_FORMAT)
            );
            // Delete request
            await UpgradeRequestModel.delete(bidderId);

            // Send email
            // Get email to send
            EmailService.sendEmailWithHTMLContent(
                user.email,
                "Upgrade to Seller",
                EmailTemplate.upgradeSellerOk()
            );

            res.redirect("/admin/bidders/upgrade");
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async postDenyBidder(req, res) {
        const { bidderId } = req.body;

        try {
            const [user] = await UserAccountModel.getByColumn("user_id", bidderId);
            if (user === undefined) {
                return res.redirect("/admin/bidders/upgrade");
            }

            await UserAccountModel.updateColumnById(bidderId, "seller_expired_date", null);
            // Delete request
            await UpgradeRequestModel.delete(bidderId);

            // Send email
            // Get email to send
            EmailService.sendEmailWithHTMLContent(
                user.email,
                "Upgrade to Seller",
                EmailTemplate.upgradeSellerDeny()
            );

            res.redirect("/admin/bidders/upgrade");
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async sellerPage(req, res) {
        // Load seller list
        try {
            const [userList] = await UserAccountModel.getAllActiveSeller();

            const sellerList = userList.map((user, index) => {
                const sellerExpiredDate = moment(user.seller_expired_date).format(
                    CommonConst.MOMENT_BASE_USER_FORMAT
                );

                let expiredType = 0;
                if (user.day_diff > 4) {
                    expiredType = 2;
                } else if (user.day_diff > 2) {
                    expiredType = 1;
                }

                return {
                    index: index + 1,
                    userId: user.user_id,
                    email: user.email,
                    fullname: `${user.first_name} ${user.last_name}`,
                    ratingPoint: user.rating_point !== null ? user.rating_point : 0,
                    sellerExpiredDate,
                    expiredType,
                };
            });

            return res.render("pages/admin/seller-list", {
                layout: "admin",
                data: {
                    sellerList,
                },
            });
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async downgradeSeller(req, res) {
        const { sellerId } = req.body;

        try {
            const [user] = await UserAccountModel.getByColumn("user_id", sellerId);
            if (user === undefined) {
                return res.redirect("/admin/sellers");
            }

            // Update seller expired date in user table: expired now
            await UserAccountModel.updateColumnById(
                sellerId,
                "seller_expired_date",
                moment().format(CommonConst.MOMENT_BASE_DB_FORMAT)
            );

            // Send email
            // Get email to send
            EmailService.sendEmailWithHTMLContent(
                user.email,
                "Downgrade to Bidder",
                EmailTemplate.downgradeSeller()
            );

            res.redirect("/admin/sellers");
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
        res.redirect("/admin/sellers");
    }

    adminDashboard(req, res) {
        res.render("pages/admin/index", {
            layout: "admin",
        });
    }
}
