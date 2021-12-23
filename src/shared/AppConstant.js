import dotenv from "dotenv";

dotenv.config();

export default class AppConstant {
    static get PORT() {
        return Number.parseInt(process.env.PORT);
    }

    static get COOKIE_KEY() {
        return process.env.COOKIE_KEY;
    }

    static get COOKIE_KEY_MAX_AGE() {
        return Number.parseInt(process.env.COOKIE_KEY_MAX_AGE);
    }

    static get PROD() {
        return process.env.MODE === "PROD";
    }

    static get ADDRESS_API_DOMAIN() {
        return "https://provinces.open-api.vn/api";
    }

    static get DB_HOST() {
        if (process.env.MODE === "DEV") {
            return process.env.MYSQL_HOST_NAME_LOCAL;
        }
        return process.env.MYSQL_HOST_NAME;
    }
    static get DB_SCHEMA() {
        if (process.env.MODE === "DEV") {
            return process.env.MYSQL_DB_SCHEMA_LOCAL;
        }
        return process.env.MYSQL_DB_SCHEMA;
    }

    static get DB_USER_NAME() {
        if (process.env.MODE === "DEV") {
            return process.env.MYSQL_USER_NAME_LOCAL;
        }
        return process.env.MYSQL_USER_NAME;
    }

    static get DB_PASSWORD() {
        if (process.env.MODE === "DEV") {
            return process.env.MYSQL_PASSWORD_LOCAL;
        }
        return process.env.MYSQL_PASSWORD;
    }
}
