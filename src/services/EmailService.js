import nodeMailer from "nodemailer";
import { EMAIL_CONFIG } from "../config/index.js";

class EmailService {
    #transporter;
    constructor() {
        this.#transporter = nodeMailer.createTransport({
            host: EMAIL_CONFIG.host,
            port: EMAIL_CONFIG.port,
            secure: EMAIL_CONFIG.SECURE,
            auth: {
                user: EMAIL_CONFIG.user,
                pass: EMAIL_CONFIG.password,
            },
        });
    }

    // TODO: must revise this section
    async sendEmailWithHTMLContent(to, subject, html) {
        const sendOption = { from: EMAIL_CONFIG.user, to, subject, html };

        return this.#transporter.sendMail(sendOption);
    }
}

export default new EmailService();
