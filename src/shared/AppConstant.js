import dotenv from "dotenv";

dotenv.config();

export default class AppConstant {
    static get PORT() {
        return process.env.PORT;
    }

    static get COOKIE_KEY() {
        return process.env.COOKIE_KEY;
    }

    static get COOKIE_KEY_MAX_AGE() {
        return process.env.COOKIE_KEY_MAX_AGE;
    }

    static get PROD() {
        return process.env.PROD;
    }
}
