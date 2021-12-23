import { authenticator } from "otplib";

// https://github.com/yeojz/otplib#totp-options
authenticator.options = { digits: 6, step: 300 }; // expired in 5 minutes

export default authenticator;
