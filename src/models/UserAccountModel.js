import KnexConnection from "../utils/KnexConnection.js";

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
}
