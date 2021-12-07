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
        res.send("Home");
    }
}
