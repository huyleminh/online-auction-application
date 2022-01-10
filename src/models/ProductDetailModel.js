import KnexConnection from "../utils/KnexConnection.js";

export default class ProductDetailModel {
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

    static updateDescription(productId, description) {
        return new Promise(async function (resolve, reject) {
            try {
                const resultSet = KnexConnection("product_detail")
                    .where({ product_id: productId })
                    .update({ description });

                resolve(resultSet)
            } catch (error) {
                reject(error)
            }
        })
    }
}
