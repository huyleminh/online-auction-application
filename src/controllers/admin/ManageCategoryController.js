import AppController from "../AppController.js";
import AuthMiddlewares from "../../middlewares/AuthMiddlewares.js";

export default class ManagCategoryController extends AppController {
    constructor() {
        super();

        this.init();
    }

    init() {
        this._router.get("/admin/categories", AuthMiddlewares.authorizeAdmin, this.categoryPage);
        this._router.post(
            "/admin/categories/create",
            AuthMiddlewares.authorizeAdmin,
            this.postCreateCat
        );
        this._router.post(
            "/admin/categories/delete",
            AuthMiddlewares.authorizeAdmin,
            this.postDeleteCat
        );
        this._router.post(
            "/admin/categories/update",
            AuthMiddlewares.authorizeAdmin,
            this.postUpdateCat
        );
    }

    categoryPage(req, res) {
        res.render("pages/admin/category-list", {
            layout: "admin",
        });
    }

    postCreateCat(req, res) {
        const { body } = req;
        console.log(body);
        res.redirect("/admin/categories");
    }

    postDeleteCat(req, res) {
        const { body } = req;
        console.log(body);
        res.redirect("/admin/categories");
    }

    postUpdateCat(req, res) {
        const { body } = req;
        console.log(body);
        res.redirect("/admin/categories");
    }
}
