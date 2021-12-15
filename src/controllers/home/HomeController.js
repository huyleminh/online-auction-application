import AppController from "../AppController.js";

export default class HomeController extends AppController {
    constructor() {
        super();
        this.init();
    }

    init() {
        this._router.get("/", this.renderHome);
    }

    renderHome(req, res) {
        res.render("pages/home", {
            products: {
                topDue: [1, 2, 3, 4, 5, 6, 7],
                topBidded: [1, 2, 3, 4, 5, 6, 7],
                topHighest: [1, 2, 3, 4, 5, 6, 7],
            },
        });
    }
}
