import express from "express";
import { create } from "express-handlebars";
import HandlebarsSection from "express-handlebars-sections";
import session from "express-session";
import morgan from "morgan";
import passport from "passport";
import { dirname } from "path";
import { fileURLToPath } from "url";
import AppControllers from "./controllers/index.js";
import AppConstant from "./shared/AppConstant.js";
import flash from "connect-flash";
import LocalsMiddlewares from "./middlewares/LocalsMiddlewares.js";
import HbsHelper from "./utils/helpers/HbsHelper.js";

class AppServer {
    constructor() {
        this.app = express();
        this.port = AppConstant.PORT;
        this.__dirname = dirname(fileURLToPath(import.meta.url));
    }

    initializeGlobalMiddlewares() {
        this.app.use(express.urlencoded({ extended: true }));

        this.app.use(express.static("public"));

        // morgan
        this.app.use(
            morgan(
                "[:date[web]] :remote-addr :method :url :status :res[content-length] - :response-time ms"
            )
        );

        this.app.use(
            session({
                secret: AppConstant.COOKIE_KEY,
                resave: false,
                saveUninitialized: true,
                cookie: {
                    secure: AppConstant.PROD,
                    maxAge: AppConstant.COOKIE_KEY_MAX_AGE,
                },
            })
        );

        //passport
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use(flash());

        LocalsMiddlewares.getAll().forEach((mdw) => this.app.use(mdw));
    }

    initializeViewEngine() {
        const handlebars = create({
            layoutsDir: `${this.__dirname}/views/layouts`,
            partialsDir: `${this.__dirname}/views/partials`,
            defaultLayout: "main",
            extname: "hbs",
            helpers: {
                ...HbsHelper.getAll(),
            },
        });

        HandlebarsSection(handlebars);

        this.app.engine("hbs", handlebars.engine);
        this.app.set("view engine", "hbs");
        this.app.set("views", `${this.__dirname}/views`);
    }

    initializeControllers() {
        AppControllers.forEach((controller) => {
            this.app.use("/", controller._router);
        });
    }

    initializeOutMiddlewares() {
        this.app.use("/403", function (req, res) {
            res.render("pages/errors/403", { layout: false });
        });
        this.app.use(function (req, res, next) {
            res.render("pages/errors/404", { layout: false });
        });

        this.app.use(function (err, req, res, next) {
            console.error(err.stack);
            res.render("pages/errors/500", { layout: false });
        });
    }

    start() {
        this.initializeGlobalMiddlewares();
        this.initializeViewEngine();
        this.initializeControllers();
        this.initializeOutMiddlewares();

        this.app.listen(this.port, () => {
            console.log(`Server is listening on http://localhost:${this.port}`);
        });
    }
}

const appServer = new AppServer();
appServer.start();
