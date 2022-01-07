import KnexConnection from "../utils/KnexConnection.js";

export default class WishlistModel {
    static getWishlistByUserId(userId) {
        return new Promise(async function (resolve, reject) {
            try {
                const res = await KnexConnection('wishlist')
                .join('product', 'wishlist.product_id', '=', 'product.product_id')
                .select('product.product_id', 'product.product_name', 'product.thumbnail', 'product.current_price', 'product.is_sold', 'product.expired_date')
                .where('wishlist.user_id', userId);
                resolve(res);
            } catch (err) {
                reject(err);
            }
        })
    }

    static removeWishlistById(userId, product_id) {
        return new Promise(async function (resolve, reject) {
            try {
                const res = await KnexConnection('wishlist')
                .where({
                    user_id: userId,
                    product_id: product_id
                }).del();
                resolve(res);
            } catch (err) {
                reject(err);
            }
        })
    }
}
