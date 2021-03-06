import KnexConnection from "../utils/KnexConnection.js";

export default class AutoBiddingJobModel {
    static getAll() {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection("auto_bidding_job").select();
                resolve(dataSet);
            } catch (error) {
                reject(error);
            }
        });
    }

    static getByProductId(productId) {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection("auto_bidding_job")
                    .where({ product_id: productId })
                    .select();
                resolve(dataSet);
            } catch (error) {
                reject(error);
            }
        });
    }

    static getByJobId(jobId) {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection("auto_bidding_job")
                    .where({ job_id: jobId })
                    .select();
                resolve(dataSet);
            } catch (error) {
                reject(error);
            }
        });
    }

    static delete(jobId) {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection("auto_bidding_job")
                    .where({ job_id: jobId })
                    .del();
                resolve(dataSet);
            } catch (error) {
                reject(error);
            }
        });
    }

    static deleteWithProductId(productId) {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection("auto_bidding_job")
                    .where({ product_id: productId })
                    .del();
                resolve(dataSet);
            } catch (error) {
                reject(error);
            }
        });
    }

    static insert(entity) {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection("auto_bidding_job").insert(entity);
                resolve(dataSet);
            } catch (error) {
                reject(error);
            }
        });
    }

    static update(jobId, entity) {
        return new Promise(async function (resolve, reject) {
            try {
                const dataSet = await KnexConnection("auto_bidding_job")
                    .where({ job_id: jobId })
                    .update(entity);
                resolve(dataSet);
            } catch (err) {
                reject(err);
            }
        });
    }
}
