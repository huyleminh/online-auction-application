import axios from "axios";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import GoogleConfig from "../../config/GoogleConfig.js";
import UserAccountModel from "../../models/UserAccountModel.js";
import EmailService from "../../services/EmailService.js";
import Authenticator from "../../utils/Authenticatior.js";
import EmailTemplate from "../../shared/template/EmailTemplate.js";
import AppController from "../AppController.js";
import bcrypt from "bcrypt";

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    done(null, id);
});

passport.use(
    new GoogleStrategy(
        {
            clientID: GoogleConfig.AUTH_CLIENT_ID,
            clientSecret: GoogleConfig.AUTH_CLIENT_SECRET,
            callbackURL: "/login/google/callback",
        },
        function (token, tokenSecret, profile, done) {
            console.log({ profile });
            done(null, "user_login_google");
        }
    )
);

passport.use(
    new LocalStrategy(function (username, password, done) {
        console.log({ username, password });
        done(null, "user_login_normal");
    })
);

export default class AuthController extends AppController {
    constructor() {
        super();
        this.init();
    }

    init() {
        this._router.get("/login", this.loginPage);
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
                return res.redirect("/");
            }
        );

        this._router.post(
            "/login",
            passport.authenticate("local", {
                successRedirect: "/",
                failureRedirect: "/login",
                failureFlash: true,
            })
        );

        // Register routes
        this._router.get("/signup", this.signupPage);
        this._router.post("/signup", this.postSignup);
        this._router.post("/api/signup/otp", this.getSignupOTP);
        this._router.get("/api/signup/verify/:username", this.verifyExistedUsername);

        // Forget password routes
        this._router.get("/forget-pwd", this.forgetPwdPage);
        this._router.post("/forget-pwd", this.postForgetPwdPage);
        this._router.post("/forget-pwd/verify", this.verifyForgetPwdOTP);
        this._router.get("/forget-pwd/reset-pwd", this.resetPwdPage);
        this._router.post("/forget-pwd/reset-pwd", this.postResetPwd);
    }

    loginPage(req, res) {
        res.render("pages/auth/login", {
            layout: "auth.hbs",
        });
    }

    signupPage(req, res) {
        res.render("pages/auth/signup", {
            layout: "auth.hbs",
        });
    }

    async postSignup(req, res) {
        const body = req.body;
        console.log(body);

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

        const address = `${body.addressDetail}, ${body.ward}, ${body.district}, ${body.province}`;

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(body.password, salt);

        const insertData = {
            username: body.username,
            password: hash,
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
            const emailRes = await UserAccountModel.verifyExistsValueInColumn("email", email);
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
            const emailRes = await EmailService.sendEmailWithHTMLContent(
                email,
                `OTP verification`,
                EmailTemplate.OTPTemplate(token)
            );
            console.log(emailRes);
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
            const usernameList = await UserAccountModel.verifyExistsValueInColumn(
                "username",
                newUsername
            );
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
        // Safety
        delete req.session.resetPwdEmail;

        res.render("pages/auth/forget-pwd", {
            layout: "auth.hbs",
        });
    }

    postForgetPwdPage(req, res) {
        // Send OTP to
        // If OK
        req.session.resetPwdEmail = req.body.email;
        // TODO: set epired time
        req.session.expiredTime = "need to be set";

        res.render("pages/auth/forget-pwd", {
            layout: "auth.hbs",
            sendOtpOk: true,
        });
    }

    verifyForgetPwdOTP(req, res) {
        const body = req.body;
        console.log({ body });

        console.log(req.session.resetPwdEmail);

        // If OK
        req.session.isOtpOk = true;

        res.redirect("/forget-pwd/reset-pwd");
    }

    resetPwdPage(req, res) {
        // Need to check expired time
        const expiredTime = req.session.expiredTime;
        console.log(expiredTime);

        res.render("pages/auth/reset-pwd", {
            layout: "auth.hbs",
        });
    }

    postResetPwd(req, res) {
        const body = req.body;
        console.log(body);

        // Check otp status, expired date, email, ...
        res.redirect("/login");
    }
}
