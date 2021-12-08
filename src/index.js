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
    }

    initializeViewEngine() {
        const handlebars = create({
            layoutsDir: `${this.__dirname}/views/layouts`,
            partialsDir: `${this.__dirname}/views/partials`,
            defaultLayout: "main",
            extname: "hbs",
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

    start() {
        this.initializeGlobalMiddlewares();
        this.initializeViewEngine();
        this.initializeControllers();

        this.app.listen(this.port, () => {
            console.log(`Server is listening on http://localhost:${this.port}`);
        });
    }
}

const appServer = new AppServer();
appServer.start();
