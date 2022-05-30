import nodeMailer from "nodemailer";
import EmailConfig from "../config/EmailConfig.js";

class EmailService {
    #transporter;
    constructor() {
        this.#transporter = nodeMailer.createTransport({
            host: EmailConfig.HOST,
            port: EmailConfig.PORT,
            // secure: EmailConfig.SECURE,
            auth: {
                user: EmailConfig.USER,
                pass: EmailConfig.PASSWORD,
            },
        });
    }

    // TODO: must revise this section
    async sendEmailWithHTMLContent(to, subject, html) {
        const sendOption = {
            from: "h2ateam.se@gmail.com",
            to,
            subject,
            html,
        };

        return this.#transporter.sendMail(sendOption);
    }
}

export default new EmailService();
