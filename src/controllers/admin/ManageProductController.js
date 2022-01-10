import AuthMiddlewares from "../../middlewares/AuthMiddlewares.js";
import AppController from "../AppController.js";

export default class ManageProductController extends AppController {
    constructor() {
        super();

        this.init();
    }

    init() {
        this._router.get(
            '/admin/products',
            AuthMiddlewares.authorizeAdmin,
            this.renderProductManagement
        );

        this._router.post(
            '/admin/products/delete',
            AuthMiddlewares.authorizeAdmin,
            this.deleteProduct
        );
    }

    renderProductManagement(req, res) {
        return res.render("pages/admin/product-list", {
            layout: "admin",
        })
    }

    deleteProduct(req, res) {
        return;
    }
}
