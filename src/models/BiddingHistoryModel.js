import KnexConnection from "../utils/KnexConnection.js";

export default class BiddingHistoryModel {
    static getHistoryByProductId(id) {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection("bidding_history")
                    .where({ product_id: id })
                    .orderBy("bid_date", "asc")
                    .select();
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }

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
        });
    }

    static insert(entity) {
        return new Promise(async function (resolve, reject) {
            try {
                const res = await KnexConnection("bidding_history").insert(entity);
                resolve(res);
            } catch (err) {
                reject(err);
            }
        });
    }
}
