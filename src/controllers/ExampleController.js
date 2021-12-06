import axios from "axios";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import GoogleConfig from "../config/GoogleConfig.js";
import EmailService from "../services/EmailService.js";
import AppController from "./AppController.js";

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
            callbackURL: "/example/login/google/callback",
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

export default class ExampleController extends AppController {
    constructor() {
        super();
        this.init();
    }

    init() {
        this._router.get("/example/setsession", (req, res) => {
            req.session.test = "hello";
            res.redirect("/example");
        });
        this._router.get("/example", this.renderHome);
        this._router.get(
            "/example/manage",
            (req, res, next) => {
                console.log({ user: req.user });
                console.log({ isAuth: req.isAuthenticated() });
                if (req.user === "admin") {
                    res.redirect("/example/login/google");
                } else {
                    next();
                }
            },
            this.renderManage
        );

        this._router.get(
            "/example/login/google",
            passport.authenticate("google", {
                scope: ["profile", "email"],
            })
        );

        this._router.get(
            "/example/login/google/callback",
            passport.authenticate("google", { failureRedirect: "/example/login" }),
            function (req, res) {
                res.redirect("/example");
            }
        );

        this._router.get("/example/email", async (req, res) => {
            try {
                await EmailService.sendEmailWithHTMLContent(
                    "leminhhuy.hcmus@gmail.com",
                    "test nodemailer split",
                    "<h3>Your email has been sent successfully.</h3>"
                );

                res.send("<h3>Your email has been sent successfully.</h3>");
            } catch (error) {
                console.log(error);
                res.send("email");
            }
        });

        this._router.get("/example/login", (req, res) => {
            res.render("pages/example/login", {
                layout: false,
            });
        });

        this._router.post(
            "/example/login",
            passport.authenticate("local", {
                successRedirect: "/example",
                failureRedirect: "/example/login",
                failureFlash: true,
            })
        );

        this._router.get("/example/register", function (req, res) {
            res.render("pages/example/register", { layout: false });
        });

        this._router.post("/register", async function (req, res) {
            console.log(req.body);
            const r = await axios.post(
                `https://www.google.com/recaptcha/api/siteverify?secret=${GoogleConfig.RECAPTCHA_SECRET}&response=${req.body["g-recaptcha-response"]}`
            );
            if (r.data.success) {
                res.redirect("/example");
            }
        });
    }

    renderHome(req, res) {
        console.log(req.session.test);
        res.render("pages/example/home", {
            layout: "main.hbs",
        });
    }

    renderManage(req, res) {
        console.log(req.session.test);
        res.render("pages/example/home", {
            layout: "manage.hbs",
        });
    }
}
