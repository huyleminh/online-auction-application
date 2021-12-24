import AppController from "../AppController.js";

export default class HomeController extends AppController {
    constructor() {
        super();
        this.init();
    }

    init() {
        this._router.get("/", this.renderHome);
        this._router.get("/about", this.renderAbout);
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

    renderAbout(req, res) {
        res.render("pages/about");
    }
}
