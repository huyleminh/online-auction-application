import CommonConst from "../shared/CommonConst.js";
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

    static getJoinBidderWithHighestPrice(productId, page) {
        const offset = (page - 1) * CommonConst.ITEMS_PER_TABLE_PAGE;
        return new Promise(async function (resolve, reject) {
            try {
                const res = await KnexConnection.raw(`
                    select bh.bidder_id, bh.current_price, bh.bid_date, bh.bidder_fname from bidding_history bh join (
                        select bidder_id, MAX(current_price) max_current_price
                        from bidding_history where product_id =${productId} group by bidder_id
                    ) as bh_m
                    on bh.bidder_id = bh_m.bidder_id and bh.current_price = bh_m.max_current_price
                    where bh.product_id =${productId} limit ${
                    CommonConst.ITEMS_PER_TABLE_PAGE + 1
                } offset ${offset}
                    `);

                const hasNext = res.length === CommonConst.ITEMS_PER_TABLE_PAGE + 1;
                resolve({
                    hasNext: hasNext,
                    list: res.slice(0, CommonConst.ITEMS_PER_TABLE_PAGE),
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    static findSecondLargestTolerablePriceByProductId(productId) {
        return new Promise(async function (resolve, reject) {
            try {
                const resultSet = await KnexConnection("bidding_history")
                    .where({ product_id: productId })
                    .orderBy([
                        { column: "tolerable_price", order: "desc" },
                        { column: "bid_date" }
                    ])
                    .limit(2)
                    .select();

                console.log(resultSet);

                resolve(resultSet.length < 2 ? undefined : resultSet[1]);
            } catch (error) {
                reject(error);
            }
        });
    }

    static findMinCurrentPriceByProductId(productId) {
        return new Promise(async function (resolve, reject) {
            try {
                const resultSet = await KnexConnection("bidding_history")
                    .where({ product_id: productId })
                    .orderBy("current_price")

                console.log(resultSet);

                resolve(resultSet);
            } catch (error) {
                reject(error);
            }
        });
    }
    
    static deleteWithProductId(id) {
        return new Promise(async function (resolve, reject) {
            try {
                const res = await KnexConnection('bidding_history')
                .where('product_id', id)
                .del();

                resolve(res);
            } catch (err) {
                reject(err);
            }
        });
    }
}
