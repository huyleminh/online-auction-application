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
}
