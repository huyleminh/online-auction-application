import AppController from "../AppController.js";

export default class BidderController extends AppController {
    constructor() {
        super();
        this.init();
    }

    init() {
        this._router.get("/bidder/bidding", this.renderBiddingProducts);

        this._router.get("/bidder/account/upgrade", this.renderUpgradeRequest);
        this._router.post("/bidder/account/upgrade", this.upgradeRequest);

        this._router.get("/bidder/won", this.renderWonList);
    }

    renderBiddingProducts(req, res) {
        res.render("pages/user/bidder/bidding", {
            layout: "profile",
        });
    }

    renderUpgradeRequest(req, res) {
        res.render("pages/user/bidder/upgrade", {
            layout: "profile",
        });
    }

    upgradeRequest(req, res) {
        res.redirect("/user/account");
    }

    renderWonList(req, res) {
        res.render("pages/user/bidder/wonlist", {
            layout: "profile",
        });
    }
}
