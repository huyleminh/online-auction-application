import moment from "moment";
import AuthMiddlewares from "../../middlewares/AuthMiddlewares.js";
import UpgradeRequestModel from "../../models/UpgradeRequestModel.js";
import UserAccountModel from "../../models/UserAccountModel.js";
import CommonConst from "../../shared/CommonConst.js";
import AppController from "../AppController.js";

export default class BidderController extends AppController {
    constructor() {
        super();
        this.init();
    }

    init() {
        this._router.get(
            "/bidder/bidding",
            AuthMiddlewares.authorizeUser,
            this.renderBiddingProducts
        );

        this._router.get(
            "/bidder/account/upgrade",
            AuthMiddlewares.authorizeUser,
            this.renderUpgradeRequest
        );
        this._router.post(
            "/bidder/account/upgrade",
            AuthMiddlewares.authorizeUser,
            this.upgradeRequest
        );

        this._router.get("/bidder/won", AuthMiddlewares.authorizeUser, this.renderWonList);
    }

    renderBiddingProducts(req, res) {
        res.render("pages/user/bidder/bidding", {
            layout: "profile",
        });
    }

    async renderUpgradeRequest(req, res) {
        const { user } = req;
        // Is Bidder
        // Check upgrade table
        try {
            const [userRes] = await UserAccountModel.getByColumn("username", user.username);
            if (userRes === undefined) {
                req.logout();
                return req.session.save(() => {
                    res.redirect("/login");
                });
            }

            const { seller_expired_date } = userRes;
            if (seller_expired_date && moment(seller_expired_date).isAfter(moment())) {
                // Is Seller
                return res.render("pages/user/bidder/upgrade", {
                    layout: "profile",
                    data: {
                        isSeller: true,
                        sellerExpiredDate: moment(seller_expired_date).format(
                            CommonConst.MOMENT_BASE_USER_FORMAT
                        ),
                    },
                });
            }

            const [reqData] = await UpgradeRequestModel.getByUserId(userRes.user_id);
            if (reqData === undefined) {
                return res.render("pages/user/bidder/upgrade", {
                    layout: "profile",
                    data: {
                        isSendBefore: false,
                    },
                });
            }

            return res.render("pages/user/bidder/upgrade", {
                layout: "profile",
                data: {
                    isSendBefore: true,
                    sendBeforeDate: moment(reqData.requested_at).format(
                        CommonConst.MOMENT_BASE_USER_FORMAT
                    ),
                },
            });
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async upgradeRequest(req, res) {
        const { user } = req;

        try {
            const [userRes] = await UserAccountModel.getByColumn("username", user.username);
            if (userRes === undefined) {
                req.logout();
                return req.session.save(() => {
                    res.redirect("/login");
                });
            }

            const { seler_expired_date } = userRes;
            if (seler_expired_date && moment(seler_expired_date).isAfter(moment())) {
                // Is Seller
                return res.redirect("/bidder/account/upgrade");
            }

            const [reqData] = await UpgradeRequestModel.getByUserId(userRes.user_id);
            if (reqData === undefined) {
                // Insert new request
                await UpgradeRequestModel.insert({ user_id: userRes.user_id });
            }

            return res.redirect("/bidder/account/upgrade");
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    renderWonList(req, res) {
        res.render("pages/user/bidder/wonlist", {
            layout: "profile",
        });
    }
}
