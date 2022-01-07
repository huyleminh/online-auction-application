import moment from "moment";
import AuthMiddlewares from "../../middlewares/AuthMiddlewares.js";
import BiddingHistoryModel from "../../models/BiddingHistoryModel.js";
import JoinBidderModel from "../../models/JoinBidderModel.js";
import ProductModel from "../../models/ProductModal.js";
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

    async renderBiddingProducts(req, res) {
        const page = parseInt(req.query.page || 1);

        if (isNaN(page)) {
            return res.redirect("/bidder/bidding?page=1");
        }

        try {
            const user = await UserAccountModel.getByColumn('username', req.user.username);
            if (user === undefined) {
                req.logout();
                return req.session.save(() => {
                    res.redirect("/login");
                });
            }

            let data = await JoinBidderModel.getJoinBidderByUsernameWithPage(user[0].user_id, page);

            if (data === undefined || data.data.length === 0) {
                return res.render("pages/user/bidder/bidding", {
                    layout: "profile",
                    data: {
                        list: [],
                        hasNext: false,
                        page: 1
                    }
                });
            }

            const promises = data.data.map((element) => {
                return BiddingHistoryModel.getTolerablePriceAndBidDate(user[0].user_id, element.product_id)
            })
            const additionalInfo = await Promise.all(promises);

            let result = data.data.map((element, index) => {
                element.tolerable_price = additionalInfo[index][0][0].tolerable_price;
                element.bid_date = additionalInfo[index][0][0].bid_date;
                return element;
            });

            res.render("pages/user/bidder/bidding", {
                layout: "profile",
                data: {
                    list: result,
                    hasNext: data.hasNext,
                    page: page
                }
            });
        } catch (err) {
            res.render("pages/user/bidder/bidding", {
                layout: "profile",
                data: {
                    list: [],
                    hasNext: false,
                    page: 1
                }
            });
        }
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

    async renderWonList(req, res) {
        const page = parseInt(req.query.page || 1);
        if (isNaN(page)) {
            return res.redirect("/bidder/won?page=1");
        }

        try {
            const user = await UserAccountModel.getByColumn('username', req.user.username);
            if (user === undefined) {
                req.logout();
                return req.session.save(() => {
                    res.redirect("/login");
                });
            }

            let data = await ProductModel.getWonProductsByUserId(user[0].user_id, page);

            if (data === undefined || data.data.length === 0) {
                return res.render("pages/user/bidder/wonlist", {
                    layout: "profile",
                    data: {
                        list: [],
                        hasNext: false,
                        page: 1
                    }
                });
            }

            const promises = data.data.map((element) => {
                return BiddingHistoryModel.getTolerablePriceAndBidDate(user[0].user_id, element.product_id)
            })
            const additionalInfo = await Promise.all(promises);

            let result = data.data.map((element, index) => {
                element.tolerable_price = additionalInfo[index][0][0].tolerable_price;
                return element;
            });

            res.render("pages/user/bidder/wonlist", {
                layout: "profile",
                data: {
                    list: result,
                    hasNext: data.hasNext,
                    page: page
                }
            });
        } catch (err) {
            res.render("pages/user/bidder/wonlist", {
                layout: "profile",
                data: {
                    list: [],
                    hasNext: false,
                    page: 1
                }
            });
        }
        // res.render("pages/user/bidder/wonlist", {
        //     layout: "profile",
        // });
    }
}
