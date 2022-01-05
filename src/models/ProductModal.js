import KnexConnection from "../utils/KnexConnection.js";

export default class ProductModel {
    static getTop5HighestPrice() {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection.raw(`
                    select top.product_id, top.product_name, top.thumbnail, top.current_price, top.buy_now_price, top.expired_date, top.won_bidder_id, top.bid_count, first_name, top.created_date
                    from (
                        select product_id, product_name, thumbnail, current_price, buy_now_price, expired_date, won_bidder_id, current_bidding_count as bid_count, created_date
                        from product
                        order by current_price desc limit 5
                    ) as top join user_account user on top.won_bidder_id = user.user_id ;
                `);
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }

    static getTop5Due() {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection.raw(`
                    select top.product_id, top.product_name, top.thumbnail, top.current_price, top.buy_now_price, top.expired_date, top.won_bidder_id, top.bid_count, first_name, top.created_date
                    from (
                        select product_id, product_name, thumbnail, current_price, buy_now_price, expired_date, won_bidder_id, current_bidding_count as bid_count, created_date
                        from product
                        order by expired_date asc limit 5
                    ) as top join user_account user on top.won_bidder_id = user.user_id ;
                `);
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }

    static getTop5Bid() {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection.raw(`
                    select top.product_id, top.product_name, top.thumbnail, top.current_price, top.buy_now_price, top.expired_date, top.won_bidder_id, top.bid_count, first_name, top.created_date
                    from (
                        select product_id, product_name, thumbnail, current_price, buy_now_price, expired_date, won_bidder_id, current_bidding_count as bid_count, created_date
                        from product
                        order by current_bidding_count desc limit 5
                    ) as top join user_account user on top.won_bidder_id = user.user_id ;
                `);
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }
}
