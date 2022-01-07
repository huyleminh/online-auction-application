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

    static getAllByRatedUserId(id, limit, offset) {
        return new Promise(async function (resolve, reject) {
            try {
                const res = await KnexConnection.raw(`
                    select rate.rating_id, rate.feedback, rate.is_positive, rate.rated_date, user.first_name
                    from (
                        select *
                        from rating where rated_user_id = ${id} limit ${limit} offset ${offset}
                    ) as rate join user_account user on rate.evaluator_id = user.user_id;`);
                resolve(res);
            } catch (err) {
                reject(err);
            }
        });
    }

    static countRowsByRatedUserId(id) {
        return new Promise(async function (resolve, reject) {
            try {
                const res = await KnexConnection("rating")
                    .where({ rated_user_id: id })
                    .count("rated_user_id", { as: "count" });
                resolve(res);
            } catch (err) {
                reject(err);
            }
        });
    }
}
