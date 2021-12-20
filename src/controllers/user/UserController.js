import AppController from "../AppController.js";

export default class UserController extends AppController {
    constructor() {
        super();

        this.init();
    }

    init() {
        this._router.get("/user/account", this.renderProfilePage);

        this._router.get("/user/account/email", this.renderChangeEmail);
        this._router.post("/user/account/email/send", this.sendOTPChangeEmail);
        this._router.post("/user/account/email", this.changeEmail);

        this._router.get("/user/account/password", this.renderChangePassword);
        this._router.post("/user/account/password", this.changePassword);
    }

    renderProfilePage(req, res) {
        // res.render("pages/user/index");
        res.render("pages/user/index", {
            layout: "profile",
        });
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
}
