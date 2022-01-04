import axios from "axios";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import GoogleConfig from "../../config/GoogleConfig.js";
import AuthMiddlewares from "../../middlewares/AuthMiddlewares.js";
import UserAccountModel from "../../models/UserAccountModel.js";
import EmailService from "../../services/EmailService.js";
import AppConstant from "../../shared/AppConstant.js";
import EmailTemplate from "../../shared/template/EmailTemplate.js";
import Authenticator from "../../utils/Authenticatior.js";
import PasswordHelper from "../../utils/helpers/PasswordHelper.js";
import AppController from "../AppController.js";

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(
    new GoogleStrategy(
        {
            clientID: GoogleConfig.AUTH_CLIENT_ID,
            clientSecret: GoogleConfig.AUTH_CLIENT_SECRET,
            callbackURL: "/login/google/callback",
        },
        async function (token, tokenSecret, profile, done) {
            // Verify email as username in db
            try {
                const userList = await UserAccountModel.getByColumn(
                    "username",
                    profile._json.email
                );

                if (userList.length === 0) {
                    // Create new Account here

                    const insertData = {
                        username: profile._json.email,
                        password: PasswordHelper.generateHashPassword(
                            `${profile._json.sub}-${AppConstant.GOOGLE_SECRET_PASSWORD_KEY}`
                        ),
                        email: profile._json.email,
                        first_name: profile._json.given_name,
                        last_name: profile._json.family_name,
                    };

                    try {
                        await UserAccountModel.insert(insertData);
                        return done(null, {
                            isAuth: true,
                            username: profile._json.email,
                            role: 0,
                            fullname: profile._json.name,
                            userType: "GOOGLE",
                        });
                    } catch (error) {
                        console.log("Insert new user error. ", error);
                        return done(error);
                    }
                }

                // Verify password
                const idValid = PasswordHelper.verifyHash(
                    `${profile._json.sub}-${AppConstant.GOOGLE_SECRET_PASSWORD_KEY}`,
                    userList[0].password
                );

                if (!idValid) {
                    return done(null, false, {
                        message:
                            "Invalid google account, please login with another account or register a new one",
                    });
                }

                return done(null, {
                    isAuth: true,
                    username: userList[0].username,
                    role: userList[0].role,
                    fullname: `${userList[0].first_name} ${userList[0].last_name}`,
                    userType: "GOOGLE",
                });
            } catch (error) {
                console.log(error);
                return done(error);
            }
        }
    )
);

passport.use(
    new LocalStrategy(async function (username, password, done) {
        // Verify username and password here
        try {
            const userList = await UserAccountModel.getByColumn("username", username);
            if (userList.length === 0) {
                return done(null, false, { message: "Invalid username or password" });
            }

            const isValidPassword = PasswordHelper.verifyHash(password, userList[0].password);

            if (!isValidPassword) {
                console.log("login failed");
                return done(null, false, { message: "Invalid username or password" });
            }

            return done(null, {
                isAuth: true,
                username: userList[0].username,
                role: userList[0].role,
                fullname: `${userList[0].first_name} ${userList[0].last_name}`,
                userType: "NORMAL",
            });
        } catch (error) {
            console.log(error);
            return done(error);
        }
    })
);

export default class AuthController extends AppController {
    constructor() {
        super();
        this.init();
    }

    init() {
        this._router.get("/login", AuthMiddlewares.setReturnURL, this.loginPage);
        this._router.get(
            "/login/google",
            passport.authenticate("google", {
                scope: ["profile", "email"],
            })
        );
        this._router.get(
            "/login/google/callback",
            passport.authenticate("google", { failureRedirect: "/login" }),
            (req, res) => {
                req.session.save(() => {
                    res.redirect("/");
                });
            }
        );

        this._router.post("/login", function (req, res, next) {
            passport.authenticate("local", function (err, user, info) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.render("pages/auth/login", {
                        layout: "auth",
                        error: {
                            message: info.message,
                        },
                    });
                }

                req.logIn(user, function (err) {
                    if (err) {
                        return next(err);
                    }

                    const { returnUrl } = req.session;
                    delete req.session.returnUrl;
                    req.session.save(function () {
                        res.redirect(returnUrl || "/");
                    });
                });
            })(req, res, next);
        });

        // Register routes
        this._router.get("/signup", this.signupPage);
        this._router.post("/signup", this.postSignup);
        this._router.post("/api/signup/otp", this.getSignupOTP);
        this._router.get("/api/signup/verify/:username", this.verifyExistedUsername);

        // Forget password routes
        this._router.get("/forget-pwd", this.forgetPwdPage);
        this._router.post("/forget-pwd", this.postForgetPwdPage);
        this._router.post("/api/forget-pwd/otp", this.getForgetPwdOTP);
        this._router.get("/forget-pwd/reset-pwd", this.resetPwdPage);
        this._router.post("/forget-pwd/reset-pwd", this.postResetPwd);

        // Logout
        this._router.post("/logout", this.handleLogout);
    }

    loginPage(req, res) {
        const { flash } = req.session;
        delete req.session.flash;

        res.render("pages/auth/login", {
            layout: "auth.hbs",
            error: {
                message: flash?.error ? flash.error[0] : null,
            },
        });
    }

    signupPage(req, res) {
        res.render("pages/auth/signup", {
            layout: "auth.hbs",
        });
    }

    async postSignup(req, res) {
        const body = req.body;

        const recaptchaRes = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${GoogleConfig.RECAPTCHA_SECRET}&response=${body["g-recaptcha-response"]}`
        );

        if (!recaptchaRes.data.success) {
            return res.render("pages/auth/signup", {
                layout: "auth",
                error: {
                    recaptcha: "Invalid recaptcha",
                },
            });
        }

        // Verify OTP
        const { otpCode } = body;
        const secret = req.session.otpTempSecret;
        delete req.session.otpTempSecret;

        const isValid = Authenticator.verify({ token: otpCode, secret: secret });
        if (!isValid) {
            return res.render("pages/auth/signup", {
                layout: "auth",
                error: {
                    otp: "Your OTP code is incorrect or expired",
                },
            });
        }

        const address = JSON.stringify({
            province: body.province,
            district: body.district,
            ward: body.ward,
            address: body.addressDetail,
        });

        const insertData = {
            username: body.username,
            password: PasswordHelper.generateHashPassword(body.password),
            email: body.email,
            address,
            first_name: body.firstname,
            last_name: body.lastname,
        };

        try {
            await UserAccountModel.insert(insertData);
            res.redirect("/login");
        } catch (error) {
            console.log("Insert new user error. ", error);
            res.redirect("/signup");
        }
    }

    async getSignupOTP(req, res) {
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
        const token = Authenticator.generate(secret);

        try {
            await EmailService.sendEmailWithHTMLContent(
                email,
                `Register - OTP Verification`,
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

    async verifyExistedUsername(req, res) {
        const newUsername = req.params.username;

        try {
            const usernameList = await UserAccountModel.getByColumn("username", newUsername);
            if (usernameList.length === 0) {
                res.json({ status: 200 });
            } else {
                res.json({ status: 400 });
            }
        } catch (error) {
            console.log(error);
            res.json({ status: 500 });
        }
    }

    forgetPwdPage(req, res) {
        res.render("pages/auth/forget-pwd", {
            layout: "auth.hbs",
        });
    }

    async getForgetPwdOTP(req, res) {
        const { email } = req.body;

        try {
            // check if username is google username
            const userList = await UserAccountModel.getUsernameByEmail(email);
            if (userList.length === 0) {
                return res.json({ status: 400, message: "Invalid email" });
            }

            if (userList[0].username.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
                return res.json({
                    status: 400,
                    message: "You do not have permission to reset password of this account",
                });
            }

            // Generate OTP
            const secret = Authenticator.generateSecret(); // base32 encoded hex secret key
            const token = Authenticator.generate(secret + email);

            await EmailService.sendEmailWithHTMLContent(
                email,
                `Forgot Password - OTP Verification`,
                EmailTemplate.OTPForgotPasswordTemplate(token)
            );

            // delete old secret here
            delete req.session.otpTempForgotPwdSecret;
            req.session.otpTempForgotPwdSecret = secret;
            req.session.usernameTempForgotPwd = userList[0].username;

            res.json({ status: 200 });
        } catch (error) {
            console.log(error);
            return res.json({ status: 500 });
        }
    }

    postForgetPwdPage(req, res) {
        const { email, otpCode } = req.body;

        // Verify OTP
        const secret = req.session.otpTempForgotPwdSecret;
        if (!secret) {
            return res.redirect("/forget-pwd");
        }

        delete req.session.otpTempForgotPwdSecret;

        const isValid = Authenticator.verify({ token: otpCode, secret: secret + email });
        if (!isValid) {
            return res.render("pages/auth/forget-pwd", {
                layout: "auth",
                error: {
                    otp: "Your OTP code is incorrect or expired",
                },
            });
        }

        req.session.isFgPwd = true;
        req.session.save(() => {
            res.redirect("/forget-pwd/reset-pwd");
        });
    }

    resetPwdPage(req, res) {
        res.render("pages/auth/reset-pwd", {
            layout: "auth.hbs",
        });
    }

    async postResetPwd(req, res) {
        const { usernameTempForgotPwd, isFgPwd } = req.session;
        if (!usernameTempForgotPwd || !isFgPwd) {
            return res.redirect("/forget-pwd");
        }

        delete req.session.emailFgPwd;
        delete req.session.isFgPwd;

        const { password } = req.body;

        try {
            await UserAccountModel.updateColumnByUsername(
                usernameTempForgotPwd,
                "password",
                PasswordHelper.generateHashPassword(password)
            );
            res.redirect("/login");
        } catch (error) {
            console.log("change password error ", error);
            res.redirect("/forget-pwd");
        }
    }

    handleLogout(req, res) {
        req.logout();
        req.session.save(() => {
            res.redirect(req.headers.referer || "/");
        });
    }
}
