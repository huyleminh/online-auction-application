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

    static getAllWithKeyWord(key, limit, offset) {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection.raw(`
                    select prod.product_id, prod.product_name, prod.thumbnail, prod.current_price,
                    prod.buy_now_price, prod.expired_date, prod.created_date, user.first_name, prod.bid_count
                    from (
                        select product_id, product_name, thumbnail, current_price, buy_now_price, expired_date, p.created_date, won_bidder_id, current_bidding_count as bid_count
                        from product p join category c on p.cat_id = c.cat_id
                        where (MATCH(cat_name) AGAINST('${key}')) or MATCH(product_name) AGAINST('${key}')
                        limit ${limit} offset ${offset}
                    ) as prod join user_account user on prod.won_bidder_id = user.user_id;
                `);
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }

    static getAllWithKeyWordProd(key, limit, offset) {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection.raw(`
                    select prod.product_id, prod.product_name, prod.thumbnail, prod.current_price,
                    prod.buy_now_price, prod.expired_date, prod.created_date, user.first_name, prod.bid_count
                    from (
                        select product_id, product_name, thumbnail, current_price, buy_now_price, expired_date, created_date, won_bidder_id, current_bidding_count as bid_count
                        from product where match(product_name) against('${key}')
                        limit ${limit} offset ${offset}
                    ) as prod join user_account user on prod.won_bidder_id = user.user_id;
                `);
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }

    static getAllWithKeyWordCat(key, limit, offset) {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection.raw(`
                    select prod.product_id, prod.product_name, prod.thumbnail, prod.current_price,
                    prod.buy_now_price, prod.expired_date, prod.created_date, user.first_name, prod.bid_count
                    from (
                        select product_id, product_name, thumbnail, current_price, buy_now_price, expired_date, p.created_date, won_bidder_id, current_bidding_count as bid_count
                        from product p join category c on p.cat_id = c.cat_id
                        where match(cat_name) against('${key}')
                        limit ${limit} offset ${offset}
                    ) as prod join user_account user on prod.won_bidder_id = user.user_id;
                `);
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }

    static getAllWithCatId(id, limit, offset) {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection.raw(
                    `
                        select prod.product_id, prod.product_name, prod.thumbnail, prod.current_price,
                        prod.buy_now_price, prod.expired_date, prod.created_date, user.first_name, prod.bid_count
                        from (
                        select product_id, product_name, thumbnail, current_price, buy_now_price, expired_date, created_date, won_bidder_id, current_bidding_count as bid_count
                        from product where cat_id = ${id}
                        limit ${limit} offset ${offset}
                        ) as prod join user_account user on prod.won_bidder_id = user.user_id;
                    `
                );
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }

    static getAllWithAllCat(limit, offset) {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection.raw(
                    `
                        select prod.product_id, prod.product_name, prod.thumbnail, prod.current_price,
                        prod.buy_now_price, prod.expired_date, prod.created_date, user.first_name, prod.bid_count
                        from (
                        select product_id, product_name, thumbnail, current_price, buy_now_price, expired_date, created_date, won_bidder_id, current_bidding_count as bid_count
                        from product limit ${limit} offset ${offset}
                        ) as prod join user_account user on prod.won_bidder_id = user.user_id ;
                    `
                );
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }

    static countTotalProductByCat(id) {
        return new Promise(async function (resolve, reject) {
            try {
                let dataSet;
                if (id === "all") {
                    dataSet = await KnexConnection("product")
                        .select()
                        .count("product_id", { as: "total" });
                } else {
                    dataSet = await KnexConnection("product")
                        .where({ cat_id: Number.parseInt(id) })
                        .select()
                        .count("product_id", { as: "total" });
                }
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }
}
