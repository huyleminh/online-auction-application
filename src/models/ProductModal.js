import KnexConnection from "../utils/KnexConnection.js";
import CommonConst from "../shared/CommonConst.js";
import UserAccountModel from "./UserAccountModel.js";

export default class ProductModel {
    static getTop5HighestPrice() {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection.raw(`
                    select top.product_id, top.product_name, top.thumbnail, top.current_price, top.buy_now_price, top.expired_date,
                        top.won_bidder_id, top.bid_count, first_name, top.created_date, top.is_sold
                    from (
                        select product_id, product_name, thumbnail, current_price, buy_now_price, expired_date, won_bidder_id, current_bidding_count as bid_count, created_date, is_sold
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
                        from product where is_sold = 0
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
                    select top.product_id, top.product_name, top.thumbnail, top.current_price, top.buy_now_price, top.expired_date,
                        top.won_bidder_id, top.bid_count, first_name, top.created_date, top.is_sold
                    from (
                        select product_id, product_name, thumbnail, current_price, buy_now_price, expired_date, won_bidder_id, current_bidding_count as bid_count, created_date, is_sold
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
                    prod.buy_now_price, prod.expired_date, prod.created_date, user.first_name, prod.bid_count, prod.is_sold
                    from (
                        select product_id, product_name, thumbnail, current_price, buy_now_price, expired_date, p.created_date, won_bidder_id, current_bidding_count as bid_count, is_sold
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
                    prod.buy_now_price, prod.expired_date, prod.created_date, user.first_name, prod.bid_count, prod.is_sold
                    from (
                        select product_id, product_name, thumbnail, current_price, buy_now_price, expired_date, created_date, won_bidder_id, current_bidding_count as bid_count, is_sold
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
                    prod.buy_now_price, prod.expired_date, prod.created_date, user.first_name, prod.bid_count, prod.is_sold
                    from (
                        select product_id, product_name, thumbnail, current_price, buy_now_price, expired_date, p.created_date, won_bidder_id, current_bidding_count as bid_count, is_sold
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
                        prod.buy_now_price, prod.expired_date, prod.created_date, user.first_name, prod.bid_count, prod.is_sold
                        from (
                        select product_id, product_name, thumbnail, current_price, buy_now_price, expired_date, created_date, won_bidder_id, current_bidding_count as bid_count, is_sold
                        from product where cat_id = ${id}
                        limit ${limit} offset ${offset}
                        ) as prod left join user_account user on prod.won_bidder_id = user.user_id;
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
                        prod.buy_now_price, prod.expired_date, prod.created_date, user.first_name, prod.bid_count, prod.is_sold
                        from (
                        select product_id, product_name, thumbnail, current_price, buy_now_price, expired_date, created_date, won_bidder_id, current_bidding_count as bid_count, is_sold
                        from product limit ${limit} offset ${offset}
                        ) as prod left join user_account user on prod.won_bidder_id = user.user_id ;
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

    static getWonProductsByUserId(id, page) {
        return new Promise(async function (resolve, reject) {
            const offset = (page - 1) * CommonConst.ITEMS_PER_TABLE_PAGE;
            try {
                const res = await KnexConnection("product")
                    .join("product_detail", "product.product_id", "=", "product_detail.product_id")
                    .select(
                        "product.product_id",
                        "product.product_name",
                        "product.current_price",
                        "product.thumbnail",
                        "product_detail.seller_id"
                    )
                    .where("product.won_bidder_id", "=", id)
                    .andWhere("product.is_sold", "=", 1)
                    .limit(CommonConst.ITEMS_PER_TABLE_PAGE + 1)
                    .offset(offset);
                const hasNext = res.length === CommonConst.ITEMS_PER_TABLE_PAGE + 1;
                const dataSet = res.slice(0, CommonConst.ITEMS_PER_TABLE_PAGE);
                const promises = dataSet.map((element) => {
                    return UserAccountModel.getByColumn("user_id", element.seller_id);
                });
                const additionalInfo = await Promise.all(promises);
                dataSet.map((element, index) => {
                    element.seller_name =
                        additionalInfo[index][0].first_name +
                        " " +
                        additionalInfo[index][0].last_name;
                    element.seller_rating_point = additionalInfo[index][0].rating_point;
                });
                resolve({
                    hasNext: hasNext,
                    data: res.slice(0, CommonConst.ITEMS_PER_TABLE_PAGE),
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    static getById(id) {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = KnexConnection("product").where({ product_id: id }).select();
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }

    static getRandomProductByCatId(prodId, catId, limit) {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection.raw(
                    `
                        select prod.product_id, prod.product_name, prod.thumbnail, prod.current_price,
                        prod.buy_now_price, prod.expired_date, prod.created_date, user.first_name, prod.bid_count, prod.is_sold
                        from (
                            select product_id, product_name, thumbnail, current_price, buy_now_price, expired_date, created_date,
                                    won_bidder_id, current_bidding_count as bid_count, is_sold
                            from product where cat_id = ${catId} and product_id <> ${prodId}
                            order by rand() limit ${limit}
                        ) as prod left join user_account user on prod.won_bidder_id = user.user_id ;
                    `
                );
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }

    static insertAProduct(product, detail) {
        return new Promise(async function (resolve, reject) {
            try {
                const res1 = await KnexConnection("product").insert(product);
                const res2 = await KnexConnection("product_detail").insert(detail);
                resolve({ status: true });
            } catch (err) {
                reject(err);
            }
        });
    }
}
