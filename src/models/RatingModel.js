import KnexConnection from "../utils/KnexConnection.js";

export default class RatingModel {
    static insertFeedback(feedback) {
        return new Promise(async function (resolve, reject) {
            try {
                const res = await KnexConnection("rating").insert(feedback);
                resolve(res);
            } catch (err) {
                reject(err);
            }
        });
    }
}
