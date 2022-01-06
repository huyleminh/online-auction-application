import CommonConst from "../shared/CommonConst.js";
import KnexConnection from "../utils/KnexConnection.js";

export default class JoinBidderModel {
    static async getJoinBidderByUsernameWithPage(userId, page) {
        return new Promise(async function (resolve, reject) {
            const offset = (page - 1) * CommonConst.ITEMS_PER_TABLE_PAGE;
            try {
                const res = await KnexConnection.raw(`
                select p.product_id, p.product_name, p.current_price, p.expired_date, j.is_banned, p.thumbnail, p.won_bidder_id
                from join_bidder j join product p on j.product_id = p.product_id
                where j.bidder_id = ${userId} and p.is_sold = 0 and datediff(p.expired_date, current_timestamp) > 0
                limit ${CommonConst.ITEMS_PER_TABLE_PAGE + 1} offset ${offset}`);
                const hasNext = res[0].length === CommonConst.ITEMS_PER_TABLE_PAGE + 1;
                const dataSet = res[0].slice(0, CommonConst.ITEMS_PER_TABLE_PAGE);
                dataSet.map((element) => {
                    element.status = element.won_bidder_id === userId;
                })
                resolve({
                    hasNext: hasNext,
                    data: dataSet
                });
            } catch (err) {
                reject(err);
            }
        })
    }
}