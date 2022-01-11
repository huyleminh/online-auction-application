import KnexConnection from "../utils/KnexConnection.js";
import CommonConst from "../shared/CommonConst.js";
import UserAccountModel from "./UserAccountModel.js";

const makeOrderByStatement = (sortType, aliasTable) => {
	switch (sortType) {
        case "price_asc":
            return `order by ${aliasTable}.current_price asc, ${aliasTable}.buy_now_price asc`;
        case "price_desc":
            return `order by ${aliasTable}.current_price desc, ${aliasTable}.buy_now_price desc`;
        case "time_asc":
            return `order by ${aliasTable}.expired_date asc`;
        case "time_desc":
            return `order by ${aliasTable}.expired_date desc`;
        default:
            return "";
    }
}

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
                    ) as top left join user_account user on top.won_bidder_id = user.user_id ;
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
                    ) as top left join user_account user on top.won_bidder_id = user.user_id ;
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

    static getAllWithKeyWord(key, limit, offset, sortType) {
        return new Promise(async function (resolve, reject) {
            try {
                const orderByStatement = makeOrderByStatement(sortType, "product");
                const dataSet = await KnexConnection.raw(`
                    select prod.product_id, prod.product_name, prod.thumbnail, prod.current_price,
                    prod.buy_now_price, prod.expired_date, prod.created_date, user.first_name, prod.bid_count, prod.is_sold
                    from (
                        select product_id, product_name, thumbnail, current_price, buy_now_price, expired_date, p.created_date, won_bidder_id, current_bidding_count as bid_count, is_sold
                        from product p join category c on p.cat_id = c.cat_id
                        where (MATCH(cat_name) AGAINST('${key}')) or MATCH(product_name) AGAINST('${key}')
                        ${orderByStatement} limit ${limit} offset ${offset}
                    ) as prod join user_account user on prod.won_bidder_id = user.user_id;
                `);
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }

    static getAllWithKeyWordProd(key, limit, offset, sortType) {
        return new Promise(async function (resolve, reject) {
            try {
                const orderByStatement = makeOrderByStatement(sortType, "product");
                const dataSet = await KnexConnection.raw(`
                    select prod.product_id, prod.product_name, prod.thumbnail, prod.current_price,
                    prod.buy_now_price, prod.expired_date, prod.created_date, user.first_name, prod.bid_count, prod.is_sold
                    from (
                        select product_id, product_name, thumbnail, current_price, buy_now_price, expired_date, created_date, won_bidder_id, current_bidding_count as bid_count, is_sold
                        from product where match(product_name) against('${key}')
                        ${orderByStatement} limit ${limit} offset ${offset}
                    ) as prod join user_account user on prod.won_bidder_id = user.user_id;
                `);
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }

    static getAllWithKeyWordCat(key, limit, offset, sortType) {
        return new Promise(async function (resolve, reject) {
            try {
                const orderByStatement = makeOrderByStatement(sortType, "product");
                const dataSet = await KnexConnection.raw(`
                    select prod.product_id, prod.product_name, prod.thumbnail, prod.current_price,
                    prod.buy_now_price, prod.expired_date, prod.created_date, user.first_name, prod.bid_count, prod.is_sold
                    from (
                        select product_id, product_name, thumbnail, current_price, buy_now_price, expired_date, p.created_date, won_bidder_id, current_bidding_count as bid_count, is_sold
                        from product p join category c on p.cat_id = c.cat_id
                        where match(cat_name) against('${key}')
                        ${orderByStatement} limit ${limit} offset ${offset}
                    ) as prod join user_account user on prod.won_bidder_id = user.user_id;
                `);
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }

    static getAllWithCatId(id, limit, offset, sortType) {
        return new Promise(async function (resolve, reject) {
            try {
                const orderByStatement = makeOrderByStatement(sortType, "product");
                const dataSet = await KnexConnection.raw(
                    `
                        select prod.product_id, prod.product_name, prod.thumbnail, prod.current_price,
                        prod.buy_now_price, prod.expired_date, prod.created_date, user.first_name, prod.bid_count, prod.is_sold
                        from (
                        select product_id, product_name, thumbnail, current_price, buy_now_price, expired_date, created_date, won_bidder_id, current_bidding_count as bid_count, is_sold
                        from product where cat_id = ${id}
                        ${orderByStatement} limit ${limit} offset ${offset}
                        ) as prod left join user_account user on prod.won_bidder_id = user.user_id;
                    `
                );
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }

    static getAllWithAllCat(limit, offset, sortType) {
        return new Promise(async function (resolve, reject) {
            try {
                const orderByStatement = makeOrderByStatement(sortType, "product");
                const dataSet = await KnexConnection.raw(
                    `
                        select prod.product_id, prod.product_name, prod.thumbnail, prod.current_price,
                        prod.buy_now_price, prod.expired_date, prod.created_date, user.first_name, prod.bid_count, prod.is_sold
                        from (
                        select product_id, product_name, thumbnail, current_price, buy_now_price, expired_date, created_date, won_bidder_id, current_bidding_count as bid_count, is_sold
                        from product ${orderByStatement} limit ${limit} offset ${offset}
                        ) as prod left join user_account user on prod.won_bidder_id = user.user_id;
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
                resolve(res1);
            } catch (err) {
                reject(err);
            }
        });
    }

    static getSellingProductsByUserId(id, page) {
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
                        "product.is_sold",
                        "product.expired_date",
                        "product.created_date",
                        "product.is_allow_all",
                        "product_detail.step_price",
                        "product_detail.auto_extend"
                    )
                    .where("product_detail.seller_id", "=", id)
                    .limit(CommonConst.ITEMS_PER_TABLE_PAGE + 1)
                    .offset(offset);
                const hasNext = res.length === CommonConst.ITEMS_PER_TABLE_PAGE + 1;
                resolve({
                    hasNext: hasNext,
                    data: res.slice(0, CommonConst.ITEMS_PER_TABLE_PAGE),
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    static update(productId, entity) {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection("product")
                    .where({ product_id: productId })
                    .update(entity);
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }

    static getExpiredAndSoldProductsBySellerId(sellerId, page) {
        return new Promise(async function (resolve, reject) {
            const offset = (page - 1) * CommonConst.ITEMS_PER_TABLE_PAGE;
            try {
                const resultSet = await KnexConnection.raw(`
                    select
                        product.product_name,
                        product.current_price,
                        product.thumbnail,
                        product.is_sold,
                        user_account.first_name,
                        user_account.rating_point,
                        product.expired_date,
                        product.won_bidder_id
                    from product join product_detail on product.product_id = product_detail.product_id
                    left join user_account on product.won_bidder_id = user_account.user_id
                    where product_detail.seller_id = ${sellerId}
                    and (product.expired_date <= current_timestamp or is_sold = 1)
                    limit ${CommonConst.ITEMS_PER_TABLE_PAGE + 1} offset ${offset}
                `);

                const hasNext = resultSet.length === CommonConst.ITEMS_PER_TABLE_PAGE + 1;
                resolve({
                    hasNext: hasNext,
                    data: resultSet.slice(0, CommonConst.ITEMS_PER_TABLE_PAGE),
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    static getAllWithPagination(page) {
        return new Promise(async function (resolve, reject) {
            const offset = (page - 1) * CommonConst.ITEMS_PER_TABLE_PAGE;
            try {
                const dataSet = await KnexConnection.raw(
                    `
                        select prod.product_id, prod.product_name, prod.thumbnail,
                        prod.expired_date, prod.created_date, prod.bid_count, prod.is_sold, cat.cat_name
                        from (
                        select product_id, product_name, thumbnail, expired_date, created_date, current_bidding_count as bid_count, is_sold, cat_id
                        from product limit ${CommonConst.ITEMS_PER_TABLE_PAGE + 1} offset ${offset}
                        ) as prod join category cat on prod.cat_id = cat.cat_id;
                    `
                );
                resolve({
                    hasNext: dataSet[0].length === CommonConst.ITEMS_PER_TABLE_PAGE + 1,
                    data: dataSet[0].slice(0, CommonConst.ITEMS_PER_TABLE_PAGE)
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    static deleteWithProductId(id) {
        return new Promise(async function (resolve, reject) {
            try {
                const res = await KnexConnection('product')
                .where('product_id', id)
                .del();

                resolve(res);
            } catch (err) {
                reject(err);
            }
        });
    }
}
