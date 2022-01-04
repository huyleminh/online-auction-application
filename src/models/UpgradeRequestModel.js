import KnexConnection from "../utils/KnexConnection.js";

export default class UpgradeRequestModel {
    static getByUserId(id) {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection("upgrade_request")
                    .where({ user_id: id })
                    .select();
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }

    static insert(entity) {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection("upgrade_request").insert(entity);
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }

    static getAll() {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection("upgrade_request").select();
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }

    static delete(id) {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection("upgrade_request")
                    .where({ user_id: id })
                    .del();
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }
}
