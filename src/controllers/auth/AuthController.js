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
    }

    loginPage(req, res) {
        res.render("pages/auth/login", {
            layout: false,
        });
    }

    signupPage(req, res) {
        res.render("pages/auth/signup", {
            layout: false,
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
}