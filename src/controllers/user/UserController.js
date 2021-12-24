import AuthMiddlewares from "../../middlewares/AuthMiddlewares.js";
import AppController from "../AppController.js";

export default class UserController extends AppController {
    constructor() {
        super();

        this.init();
    }

    init() {
        this._router.get("/user/account", AuthMiddlewares.authorizeUser, this.renderProfilePage);
        this._router.post("/user/account", AuthMiddlewares.authorizeUser, this.changeProfile);

        this._router.get(
            "/user/account/email",
            AuthMiddlewares.authorizeUser,
            this.renderChangeEmail
        );
        this._router.post(
            "/user/account/email/send",
            AuthMiddlewares.authorizeUser,
            this.sendOTPChangeEmail
        );
        this._router.post("/user/account/email", AuthMiddlewares.authorizeUser, this.changeEmail);

        this._router.get(
            "/user/account/password",
            AuthMiddlewares.authorizeUser,
            this.renderChangePassword
        );
        this._router.post(
            "/user/account/password",
            AuthMiddlewares.authorizeUser,
            this.changePassword
        );

        this._router.get("/user/wishlist", AuthMiddlewares.authorizeUser, this.renderWishlist);
        this._router.post(
            "/user/wishlist/delete",
            AuthMiddlewares.authorizeUser,
            this.removeWishlistItem
        );

        this._router.post("/user/feedback", AuthMiddlewares.authorizeUser, this.postFeedback);
    }

    renderProfilePage(req, res) {
        // res.render("pages/user/index");
        res.render("pages/user/index", {
            layout: "profile",
        });
    }

    changeProfile(req, res) {
        const body = req.body;
        console.log(body);
        res.redirect("/user/account");
    }

    renderChangeEmail(req, res) {
        res.render("pages/user/change-email", {
            layout: "profile",
        });
    }

    sendOTPChangeEmail(req, res) {
        res.json({ status: 201 });
    }

    changeEmail(req, res) {
        const body = req.body;
        console.log({ body });
        res.redirect("/user/account");
    }

    renderChangePassword(req, res) {
        res.render("pages/user/change-pass", {
            layout: "profile",
        });
    }

    changePassword(req, res) {
        const body = req.body;
        console.log({ body });
        res.redirect("/user/account");
    }

    renderWishlist(req, res) {
        res.render("pages/user/wishlist", {
            layout: "profile",
        });
    }

    removeWishlistItem(req, res) {
        const body = req.body;
        console.log(body);
        // Remove in section + remove in db
        res.redirect("/user/wishlist");
    }

    postFeedback(req, res) {
        const body = req.body;
        console.log(body);

        res.redirect(req.headers.referer);
    }
}
