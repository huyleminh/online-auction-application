import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import GoogleConfig from "../../config/GoogleConfig.js";
import AppController from "../AppController.js";

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
        this._router.get("/api/signup/otp", this.getSignupOTP);

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

    postSignup(req, res) {
        const body = req.body;
        console.log(body);
        res.redirect("/");
    }

    getSignupOTP(req, res) {
        const { email } = req.query;
        console.log(email);
        res.json({ status: 200, message: "Ok" });
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
