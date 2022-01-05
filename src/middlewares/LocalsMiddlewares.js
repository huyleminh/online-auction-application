import WishlistModel from "../models/WishlistModel.js";

export default class LocalsMiddlewares {
    // Move user in session.passport to locals
    static exchangeAuthLocalData(req, res, next) {
        const user = req.user;
        if (user) {
            res.locals.localUser = user;
        }
        next();
    }

    static async getWishlist(req, res, next) {
        const user = req.user;
        if (user) {
            let wishlist = await WishlistModel.getWishlistByUsername(user.username);
            res.locals.wishlist = {
                wishlist: wishlist,
                length: wishlist.length
            };
        }
        next();
    }

    static getAll() {
        return [this.exchangeAuthLocalData, this.getWishlist];
    }
}
