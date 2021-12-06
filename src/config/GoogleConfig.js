import dotenv from "dotenv";
dotenv.config();

export default class GoogleConfig {
    static get AUTH_CLIENT_ID() {
        return process.env.AUTH_GOOGLE_CLIENT_ID;
    }

    static get AUTH_CLIENT_SECRET() {
        return process.env.AUTH_GOOGLE_CLIENT_SECRET;
    }

    static get RECAPTCHA_SECRET() {
        return process.env.RECAPTCHA_GOOGLE_SECRET;
    }
}
