import moment from "moment";
import AuthMiddlewares from "../../middlewares/AuthMiddlewares.js";
import RatingModel from "../../models/RatingModel.js";
import UserAccountModel from "../../models/UserAccountModel.js";
import WishlistModel from "../../models/WishlistModel.js";
import EmailService from "../../services/EmailService.js";
import EmailTemplate from "../../shared/template/EmailTemplate.js";
import Authenticator from "../../utils/Authenticatior.js";
import PasswordHelper from "../../utils/helpers/PasswordHelper.js";
import AppController from "../AppController.js";

const DEFAULT_TABLE_ROW_LIMIT = 10;

export default class UserController extends AppController {
    constructor() {
        super();

        this.init();
    }

    init() {
        this._router.get("/user/account", AuthMiddlewares.authorizeUser, this.renderProfilePage);
        this._router.post("/user/account", AuthMiddlewares.authorizeUser, this.changeProfile);

        this._router.get(
            "/user/account/email",
            AuthMiddlewares.authorizeUser,
            this.renderChangeEmail
        );
        this._router.post(
            "/user/account/email/send",
            AuthMiddlewares.authorizeUser,
            this.sendOTPChangeEmail
        );
        this._router.post("/user/account/email", AuthMiddlewares.authorizeUser, this.changeEmail);

        this._router.get(
            "/user/account/password",
            AuthMiddlewares.authorizeUser,
            this.renderChangePassword
        );
        this._router.post(
            "/user/account/password",
            AuthMiddlewares.authorizeUser,
            this.changePassword
        );

        this._router.get("/user/wishlist", AuthMiddlewares.authorizeUser, this.renderWishlist);
        this._router.post(
            "/user/wishlist/delete",
            AuthMiddlewares.authorizeUser,
            this.removeWishlistItem
        );
        this._router.post(
            "/user/wishlist/add",
            AuthMiddlewares.authorizeUser,
            this.addWishlistItem
        );

        this._router.post("/user/feedback", AuthMiddlewares.authorizeUser, this.postFeedback);
    }

    async renderProfilePage(req, res) {
        const { user } = req;

        try {
            const [userRes] = await UserAccountModel.getByColumn("username", user.username);

            if (userRes === undefined) {
                req.logout();
                return req.session.save(() => {
                    res.redirect("/login");
                });
            }

            const userInfo = {
                firstname: userRes.first_name,
                lastname: userRes.last_name,
                email: userRes.email,
                dob: userRes.dob ? moment(userRes.dob).format("DD/MM/YYYY") : "",
                ...JSON.parse(userRes.address),
            };

            return res.render("pages/user/index", {
                layout: "profile",
                data: {
                    userInfo,
                },
            });
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async changeProfile(req, res) {
        const body = req.body;
        const user = req.user;

        const addressInfo = JSON.stringify({
            province: body.province,
            district: body.district,
            ward: body.ward,
            address: body.address,
        });

        try {
            await UserAccountModel.updateByUsername(user.username, {
                first_name: body.first_name,
                last_name: body.last_name,
                dob: moment(body.dob, "DD/MM/YYYY").format("YYYY-MM-DD"),
                address: addressInfo,
            });
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
        res.redirect("/user/account");
    }

    renderChangeEmail(req, res) {
        res.render("pages/user/change-email", {
            layout: "profile",
        });
    }

    async sendOTPChangeEmail(req, res) {
        const { email } = req.body;

        // Verify existed email
        try {
            const emailRes = await UserAccountModel.getByColumn("email", email);
            if (emailRes.length !== 0) {
                return res.json({ status: 400, message: "Email existed" });
            }
        } catch (error) {
            console.log(error);
            return res.json({ status: 500 });
        }

        // Generate OTP
        const secret = Authenticator.generateSecret(); // base32 encoded hex secret key
        const token = Authenticator.generate(secret + email);

        try {
            await EmailService.sendEmailWithHTMLContent(
                email,
                `Change email address - OTP Verification`,
                EmailTemplate.OTPTemplate(token)
            );

            // delete old secret here
            delete req.session.otpTempSecret;
            req.session.otpTempSecret = secret;
            res.json({ status: 200 });
        } catch (error) {
            console.log(e);
            res.json({ status: 500 });
        }
    }

    async changeEmail(req, res) {
        const { otpCode, email } = req.body;

        // Verify OTP
        const secret = req.session.otpTempSecret;
        delete req.session.otpTempSecret;

        const isValid = Authenticator.verify({ token: otpCode, secret: secret + email });
        if (!isValid) {
            return res.render("pages/user/change-email", {
                layout: "profile",
                error: {
                    otp: "Your OTP code is incorrect or expired",
                },
            });
        }

        try {
            await UserAccountModel.updateColumnByUsername(req.user.username, "email", email);
            res.redirect("/user/account");
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    renderChangePassword(req, res) {
        res.render("pages/user/change-pass", {
            layout: "profile",
        });
    }

    async changePassword(req, res) {
        const { password, newPassword } = req.body;

        try {
            const [user] = await UserAccountModel.getByColumn("username", req.user.username);
            if (user === undefined) {
                return res.redirect("/login");
            }

            // Verify password
            const oldPass = user.password;
            const isValid = PasswordHelper.verifyHash(password, oldPass);

            if (!isValid) {
                return res.render("pages/user/change-pass", {
                    layout: "profile",
                    error: {
                        password: "Invalid password",
                    },
                });
            }

            await UserAccountModel.updateColumnByUsername(
                req.user.username,
                "password",
                PasswordHelper.generateHashPassword(newPassword)
            );
            res.redirect("/user/account");
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    renderWishlist(req, res) {
        let { page } = req.query;

        const wishlist = JSON.parse(JSON.stringify(req.session.wishlist));
        if (!wishlist) {
            req.session.wishlist = {
                wishlist: [],
                length: 0,
            };
        }

        const total =
            wishlist.wishlist.length < DEFAULT_TABLE_ROW_LIMIT
                ? 1
                : Math.ceil(wishlist.wishlist.length / DEFAULT_TABLE_ROW_LIMIT);

        page = page ? parseInt(page) : 1;

        if (isNaN(page) || page < 1 || page > total) {
            page = 1;
            return res.redirect(`/user/wishlist?page=${page}`);
        }

        const list = wishlist.wishlist.splice(
            (page - 1) * DEFAULT_TABLE_ROW_LIMIT,
            DEFAULT_TABLE_ROW_LIMIT
        );

        res.render("pages/user/wishlist", {
            layout: "profile",
            data: {
                page,
                hasNext: page !== total,
                list,
            },
        });
    }

   async removeWishlistItem(req, res) {
        const { id } = req.body;

        try {
            const user = await UserAccountModel.getByColumn("username", req.user.username);
            if (user === undefined) {
                req.logout();
                return req.session.save(() => {
                    res.redirect("/login");
                });
            }

            if (req.session.wishlist) {
                const index = req.session.wishlist.wishlist.findIndex(
                    (element) => element.product_id === parseInt(id)
                );

                if (index !== -1) {
                    req.session.wishlist.wishlist.splice(index, 1);
                    req.session.wishlist.length = req.session.wishlist.wishlist.length;
                    await WishlistModel.removeWishlistById(user[0].user_id, id);
                    res.redirect("/user/wishlist");
                }
            }
        } catch (err) {
            res.redirect("/user/wishlist");
        }
    }

    async addWishlistItem(req, res) {
        const { body } = req;

        try {
            const [user] = await UserAccountModel.getByColumn("username", req.user.username);
            if (user === undefined) {
                req.logout();
                return req.session.save(() => {
                    res.redirect("/login");
                });
            }

            if (!req.session.wishlist) {
                req.session.wishlist = {
                    wishlist: [],
                    length: 0,
                };
            }
            const newProd = {
                ...body,
                current_price: +body.current_price,
                product_id: +body.product_id,
                is_sold: +body.is_sold,
            };

            const index = req.session.wishlist.wishlist.findIndex(
                (item) => item.product_id === newProd.product_id
            );
            if (index === -1) {
                req.session.wishlist.wishlist.push(newProd);
                req.session.wishlist.length++;

                WishlistModel.insert({ product_id: +body.product_id, user_id: user.user_id });
            }
            res.redirect(req.headers.referer);
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }

    async postFeedback(req, res) {
        const body = req.body;

        try {
            const user = await UserAccountModel.getByColumn('username', req.user.username);
            if (user === undefined) {
                req.logout();
                return req.session.save(() => {
                    res.redirect("/login");
                });
            }
            const feedback = {
                rated_user_id: body.ratedId,
                evaluator_id: user[0].user_id,
                is_positive: body.isPositive === 'true' ? true : false,
                feedback: body.feedback
            }

            await RatingModel.insertFeedback(feedback);

            res.redirect(req.headers.referer);
        } catch (err) {
            res.redirect(req.headers.referer);
        }

    }
}
