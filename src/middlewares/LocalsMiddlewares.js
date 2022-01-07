import UserAccountModel from "../models/UserAccountModel.js";
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
            if (!req.session.wishlist) {
                const [userFull] = await UserAccountModel.getByColumn("username", user.username);
                if (userFull === undefined) {
                    req.logout();
                    return req.session.save(() => {
                        res.redirect("/login");
                    });
                }

                const wishlist = await WishlistModel.getWishlistByUsername(userFull.user_id);
                req.session.wishlist = {
                    wishlist: wishlist,
                    length: wishlist.length,
                };
            }
            res.locals.wishlist = req.session.wishlist;
        }
        next();
    }

    static getAll() {
        return [this.exchangeAuthLocalData, this.getWishlist];
    }
}
