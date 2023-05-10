import flash from "connect-flash";
import cors from "cors";
import express from "express";
import { create } from "express-handlebars";
import HandlebarsSection from "express-handlebars-sections";
import session from "express-session";
import morgan from "morgan";
import passport from "passport";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { APP_CONFIG } from "./config/index.js";
import AppControllers from "./controllers/index.js";
import LocalsMiddlewares from "./middlewares/LocalsMiddlewares.js";
import { ScheduleJobEventInstance } from "./utils/ScheduleJobEvent.js";
import HbsHelper from "./utils/helpers/HbsHelper.js";

class AppServer {
    constructor() {
        this.app = express();
        this.port = APP_CONFIG.port;
        this.__dirname = dirname(fileURLToPath(import.meta.url));
    }

    initializeGlobalMiddlewares() {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.static("public"));
        this.app.use(morgan("[:date[web]] :remote-addr :method :url :status :res[content-length] - :response-time ms"));

        // RedisClient.initRedisConnectionAsync();

        // const redisStore = new RedisStore({
        //     client: RedisClient.getRedisClient(),
        //     prefix: "auction_app",
        // });

        this.app.set("trust proxy", 1);

        this.app.use(passport.initialize());

        this.app.use(
            cors({
                origin: APP_CONFIG.appUrl,
                credentials: true,
                allowedHeaders:
                    "X-Requested-With, X-HTTP-Method-Override, X-Request-Id, Content-Type, Authorization, Accept",
                methods: "GET, POST, PUT, PATCH, DELETE",
            })
        );

        this.app.use(
            session({
                // store: redisStore,
                secret: APP_CONFIG.cookieKey,
                name: APP_CONFIG.cookieName,
                resave: false,
                saveUninitialized: false,
                cookie: {
                    path: "/",
                    httpOnly: true,
                    secure: false,
                    maxAge: APP_CONFIG.cookieMaxAge,
                },
            })
        );

        //passport
        this.app.use(passport.session({ pauseStream: true }));
        this.app.use(passport.authenticate("session"));

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

    async start() {
        this.initializeGlobalMiddlewares();
        this.initializeViewEngine();
        this.initializeControllers();
        this.initializeOutMiddlewares();
        try {
            await ScheduleJobEventInstance.runOldScheduledJob();
            this.app.listen(this.port, () => {
                console.log(`Server is listening on PORT:${this.port}`);
            });
        } catch (error) {
            console.log(error);
        }
    }
}

const appServer = new AppServer();
appServer.start();
