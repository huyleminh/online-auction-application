import moment from "moment";
import UserAccountModel from "../models/UserAccountModel.js";
import WishlistModel from "../models/WishlistModel.js";

export default class LocalsMiddlewares {
    // Move user in session.passport to locals
    static async exchangeAuthLocalData(req, res, next) {
        const user = req.user;
        if (user) {
            res.locals.localUser = user;
            const userInfo = await UserAccountModel.getByColumn("username", user.username);
            if (userInfo === undefined) {
                res.locals.isSeller = false;
                req.logout();
                return req.session.save(() => {
                    res.redirect("/login");
                });
            }

            const { seller_expired_date } = userInfo[0];
            if (seller_expired_date && moment(seller_expired_date).isAfter(moment())) {
                res.locals.isSeller = true;
            } else {
                res.locals.isSeller = false;
            }
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
                const result = wishlist.map((element) => {
                    element.is_sold =
                        element.is_sold === 0
                            ? moment(element.expired_date).isAfter(moment())
                                ? 0
                                : 2
                            : element.is_sold;
                    return element;
                });

                req.session.wishlist = {
                    wishlist: result,
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
