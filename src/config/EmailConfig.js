import dotenv from "dotenv";

dotenv.config();

export default class EmailConfig {
    static get HOST() {
        return process.env.EMAIL_HOST;
    }

    static get PORT() {
        return process.env.EMAIL_PORT;
    }

    static get SECURE() {
        return process.env.EMAIL_SECURE;
    }

    static get USER() {
        return process.env.EMAIL_USER;
    }

    static get PASSWORD() {
        return process.env.EMAIL_PASSWORD;
    }
}