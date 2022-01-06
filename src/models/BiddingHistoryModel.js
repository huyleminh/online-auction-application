import KnexConnection from "../utils/KnexConnection.js";

export default class BiddingHistoryModel {
    static getTolerablePriceAndBidDate(userId, productId) {
        return new Promise(async function (resolve, reject) {
            try {
                const res = await KnexConnection.raw(`
                select tolerable_price, bid_date
                from bidding_history
                where bidder_id = ${userId} and product_id = ${productId}
                order by bidding_history.tolerable_price DESC
                limit 1`);
                resolve(res);
            } catch (err) {
                reject(err);
            }
        })
    }
}
