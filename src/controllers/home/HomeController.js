import moment from "moment";
import ProductModel from "../../models/ProductModal.js";
import AppController from "../AppController.js";
import CommonConst from "../../shared/CommonConst.js";
import numeral from "numeral";

export default class HomeController extends AppController {
    constructor() {
        super();
        this.init();
    }

    init() {
        this._router.get("/", this.renderHome);
        this._router.get("/about", this.renderAbout);

        this._router.get("/api/home/top5due", this.getTop5DueProducts);
        this._router.get("/api/home/top5highest", this.getTop5HighestProducts);
        this._router.get("/api/home/top5bid", this.getTop5BidProducts);
    }

    renderHome(req, res) {
        res.render("pages/home", {
            products: {
                initArray: [1, 2, 3, 4],
            },
        });
    }

    renderAbout(req, res) {
        res.render("pages/about");
    }

    async getTop5DueProducts(req, res) {
        try {
            const [top5DuePromise] = await ProductModel.getTop5Due();

            let result;
            if (top5DuePromise === undefined) {
                result = [];
            } else {
                result = top5DuePromise.map((item) => {
                    let createdDate = moment(item.created_date).locale("en").fromNow();
                    const dayDiff = -1 * moment().diff(moment(item.expired_date), "days");
                    const ret = {
                        productId: item.product_id,
                        productName: item.product_name,
                        thumbnail: item.thumbnail,
                        currentPrice: numeral(item.current_price).format("0,0"),
                        totalBids: item.bid_count !== null ? item.bid_count : 0,
                        createdDate,
                        expiredDate: moment(item.expired_date).locale("en").from(),
                        firstName: item.first_name !== null ? `****${item.first_name}` : "N/A",
                        dayDiff,
                    };

                    if (item.buy_now_price !== null) {
                        ret.buyNowPrice = numeral(item.buy_now_price).format("0,0");
                    }

                    return ret;
                });
            }

            res.json({ status: 200, data: result });
        } catch (error) {
            console.log(error);
            res.json({ status: 500 });
        }
    }

    async getTop5HighestProducts(req, res) {
        try {
            const [top5HighestPromise] = await ProductModel.getTop5HighestPrice();

            let result;
            if (top5HighestPromise === undefined) {
                result = [];
            } else {
                result = top5HighestPromise.map((item) => {
                    let createdDate = moment(item.created_date).locale("en").fromNow();
                    const dayDiff = -1 * moment().diff(moment(item.expired_date), "days");
                    const ret = {
                        productId: item.product_id,
                        productName: item.product_name,
                        thumbnail: item.thumbnail,
                        currentPrice: numeral(item.current_price).format("0,0"),
                        totalBids: item.bid_count !== null ? item.bid_count : 0,
                        createdDate,
                        expiredDate: moment(item.expired_date).locale("en").from(),
                        firstName: item.first_name !== null ? `****${item.first_name}` : "N/A",
                        dayDiff,
                        isSold: item.is_sold,
                    };

                    if (item.buy_now_price !== null) {
                        ret.buyNowPrice = numeral(item.buy_now_price).format("0,0");
                    }

                    return ret;
                });
            }

            res.json({ status: 200, data: result });
        } catch (error) {
            console.log(error);
            res.json({ status: 500 });
        }
    }

    async getTop5BidProducts(req, res) {
        try {
            const [top5BiddedPromise] = await ProductModel.getTop5Bid();

            let result;
            if (top5BiddedPromise === undefined) {
                result = [];
            } else {
                result = top5BiddedPromise.map((item) => {
                    let createdDate = moment(item.created_date).locale("en").fromNow();
                    const dayDiff = -1 * moment().diff(moment(item.expired_date), "days");
                    const ret = {
                        productId: item.product_id,
                        productName: item.product_name,
                        thumbnail: item.thumbnail,
                        currentPrice: numeral(item.current_price).format("0,0"),
                        totalBids: item.bid_count !== null ? item.bid_count : 0,
                        createdDate,
                        expiredDate: moment(item.expired_date).locale("en").from(),
                        firstName: item.first_name,
                        dayDiff,
                        isSold: item.is_sold
                    };

                    if (item.buy_now_price !== null) {
                        ret.buyNowPrice = numeral(item.buy_now_price).format("0,0");
                    }

                    return ret;
                });
            }

            res.json({ status: 200, data: result });
        } catch (error) {
            console.log(error);
            res.json({ status: 500 });
        }
    }
}
