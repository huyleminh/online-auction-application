import AppController from "../AppController.js";

export default class ProductController extends AppController {
    constructor() {
        super();
        this.init();
    }

    init() {
        this._router.get("/menu/categories/:catId", this.renderProductList);
    }

    renderProductList(req, res) {
        const { catId } = req.params;
        const { page, search, min_price, max_price } = req.query;

        // console.log({ catId, page, search, min_price, max_price });

        res.render("pages/products/index", {
            productList: [1, 2, 3, 4, 5, 6, 7],
        });
    }
}
