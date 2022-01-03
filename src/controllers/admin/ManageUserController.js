import AppController from "../AppController.js";
import AuthMiddlewares from "../../middlewares/AuthMiddlewares.js";

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

        this._router.get("/admin/sellers", AuthMiddlewares.authorizeAdmin, this.sellerPage);
        this._router.post("/admin/sellers", AuthMiddlewares.authorizeAdmin, this.downgradeSeller);

        this._router.get("/admin", AuthMiddlewares.authorizeAdmin, this.adminDashboard);
    }

    upgradePage(req, res) {
        res.render("pages/admin/upgrade-list", {
            layout: "admin",
        });
    }

    postAcceptBidder(req, res) {
        const { body } = req;
        console.log(body);
        res.redirect("/admin/bidders/upgrade");
    }

    postDenyBidder(req, res) {
        const { body } = req;
        console.log(body);
        res.redirect("/admin/bidders/upgrade");
    }

    sellerPage(req, res) {
        res.render("pages/admin/seller-list", {
            layout: "admin",
        });
    }

    downgradeSeller(req, res) {
        const { body } = req;
        console.log(body);
        res.redirect("/admin/sellers");
    }

    adminDashboard(req, res) {
        res.render("pages/admin/index", {
            layout: "admin",
        });
    }
}
