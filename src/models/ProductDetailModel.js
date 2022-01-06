import KnexConnection from "../utils/KnexConnection.js";

export default class ProdcutDetailModel {
    static getlById(id) {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = KnexConnection("product_detail").where({ product_id: id }).select();
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }
}
