import AuthMiddlewares from "../../middlewares/AuthMiddlewares.js";
import { ImageDiskUpload } from "../../middlewares/MulterUpload.js";
import AppController from "../AppController.js";

export default class SellerController extends AppController {
    constructor() {
        super();
        this.init();
    }

    init() {
        this._router.get(
            "/seller/products/create",
            AuthMiddlewares.authorizeUser,
            this.createProductPage
        );
        this._router.post(
            "/seller/products/create",
            AuthMiddlewares.authorizeUser,
            this.postCreateNewProduct
        );

        this._router.post(
            "/seller/products/upload",
            ImageDiskUpload.single("upload"),
            this.uploadProductImage
        );
    }

    createProductPage(req, res) {
        res.render("pages/user/seller/create-product", {
            layout: "profile",
        });
    }

    async postCreateNewProduct(req, res) {
        const { body } = req;
        console.log(body);

        res.redirect("/seller/products");
    }

    uploadProductImage(req, res) {
        const file = req.file;
        console.log(file);
        res.send({ url: `http://localhost:${5000}/uploads/${file.originalname}` });
    }
}
