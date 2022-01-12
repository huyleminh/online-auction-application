import KnexConnection from "../utils/KnexConnection.js";
import CommonConst from "../shared/CommonConst.js";

export default class UserAccountModel {
    static insert(data) {
        return new Promise(async function (resolve, reject) {
            try {
                const res = await KnexConnection("user_account").insert(data);
                resolve(res);
            } catch (err) {
                reject(err);
            }
        });
    }

    static getByColumn(column, value) {
        return new Promise(async function (resolve, reject) {
            try {
                const response = await KnexConnection.select()
                    .from("user_account")
                    .where({
                        [column]: value,
                    });
                resolve(response);
            } catch (err) {
                reject(err);
            }
        });
    }

    static getUsernameByEmail(email) {
        return new Promise(async function (resolve, reject) {
            try {
                const response = await KnexConnection.select("username")
                    .from("user_account")
                    .where({
                        email,
                    });
                resolve(response);
            } catch (err) {
                reject(err);
            }
        });
    }

    static updateColumnByUsername(username, column, columnVal) {
        return new Promise(async function (resolve, reject) {
            try {
                const response = await KnexConnection("user_account")
                    .where({ username })
                    .update({
                        [column]: columnVal,
                    });
                resolve(response);
            } catch (err) {
                reject(err);
            }
        });
    }

    static updateByUsername(username, entity) {
        return new Promise(async function (resolve, reject) {
            try {
                const response = await KnexConnection("user_account")
                    .where({ username })
                    .update(entity);
                resolve(response);
            } catch (err) {
                reject(err);
            }
        });
    }

    static getWithIdList(list) {
        return new Promise(async function (resolve, reject) {
            try {
                const response = await KnexConnection("user_account")
                    .whereIn("user_id", list)
                    .select();
                resolve(response);
            } catch (err) {
                reject(err);
            }
        });
    }

    static updateColumnById(id, column, columnVal) {
        return new Promise(async function (resolve, reject) {
            try {
                const response = await KnexConnection("user_account")
                    .where({ user_id: id })
                    .update({
                        [column]: columnVal,
                    });

                resolve(response);
            } catch (err) {
                reject(err);
            }
        });
    }

    static getAllActiveSeller() {
        return new Promise(async function (resolve, reject) {
            try {
                const response = await KnexConnection.raw(`
                    select user_id, email, first_name, last_name, rating_point, seller_expired_date, datediff(seller_expired_date, current_timestamp()) as day_diff
                    from user_account
                    where seller_expired_date > current_timestamp();
                `);

                resolve(response);
            } catch (err) {
                reject(err);
            }
        });
    }

    static getSellerByProductId(id) {
        return new Promise(async function (resolve, reject) {
            try {
                const response = await KnexConnection('user_account')
                .join('product_detail', 'product_detail.seller_id', '=', 'user_account.user_id')
                .where('product_detail.product_id', id)
                .select('user_account.*');
                resolve(response);
            } catch (err) {
                reject(err);
            }
        });
    }

    static searchByColumnWithPagination(page, column, value) {
        return new Promise(async function (resolve, reject) {
            try {
                const offset = (page - 1) * CommonConst.ITEMS_PER_TABLE_PAGE;
                let whereStatement = ""
                
                if (column !== undefined && value !== undefined) {
                    whereStatement = `where ${column} like '%${value}%'`
                }

                const resultSet = await KnexConnection.raw(
                    `select * from user_account ${whereStatement} 
                    limit ${CommonConst.ITEMS_PER_TABLE_PAGE + 1}
                    offset ${offset}`
                )
                const hasNext = resultSet[0].length === CommonConst.ITEMS_PER_TABLE_PAGE + 1;
                
                resolve({
                    hasNext: hasNext,
                    data: resultSet[0].slice(0, CommonConst.ITEMS_PER_TABLE_PAGE),
                });
            } catch (error) {
                reject(error);
            }
        })
    }

    static getByUserId(userId) {
        return new Promise(async function (resolve, reject) {
            try {
                const resultSet = await KnexConnection('user_account')
                    .where('user_id', userId);
                
                resolve(resultSet)
            } catch (error) {
                reject(error)
            }
        })
    }
}
