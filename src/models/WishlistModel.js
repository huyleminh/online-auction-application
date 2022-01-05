import KnexConnection from "../utils/KnexConnection.js";
import UserAccountModel from "./UserAccountModel.js";

export default class WishlistModel {
    static async getWishlistByUsername(username) {
        const user = await UserAccountModel.getByColumn('username', username);

        return new Promise(async function (resolve, reject) {
            try {
                const res = await KnexConnection('wishlist')
                .join('product', 'wishlist.product_id', '=', 'product.product_id')
                .select('product.product_id', 'product.product_name', 'product.thumbnail', 'product.current_price', 'product.is_sold', 'product.expired_date')
                .where('wishlist.user_id', user[0].user_id);
                resolve(res);
            } catch (err) {
                reject(err);
            }
        })
    }

    static async removeWishlistById(username, id) {
        const user = await UserAccountModel.getByColumn('username', username);

        return new Promise(async function (resolve, reject) {
            try {
                const res = await KnexConnection('wishlist')
                .where({
                    user_id: user[0].user_id,
                    product_id: id
                }).del();
                resolve(res);
            } catch (err) {
                reject(err);
            }
        })
    }
}
