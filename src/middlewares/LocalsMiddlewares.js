import WishlistModel from "../models/WishlistModel.js";
import UserAccountModel from "../models/UserAccountModel.js"

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
            const userFull = await UserAccountModel.getByColumn('username', user.username);
            if (userFull === undefined) {
                req.logout();
                return req.session.save(() => {
                    res.redirect("/login");
                });
            }

            let wishlist = await WishlistModel.getWishlistByUserId(userFull[0].user_id);
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
