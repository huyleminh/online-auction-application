import dotenv from "dotenv";

dotenv.config();

export const APP_CONFIG = {
    port: process.env.PORT ? +process.env.PORT : 5000,
    cookieKey: process.env.COOKIE_KEY || "",
    cookieName: process.env.COOKIE_NAME || "",
    cookieMaxAge: process.env.COOKIE_KEY_MAX_AGE ? +process.env.COOKIE_KEY_MAX_AGE : 86400000,
    api: {
        address: { url: "https://provinces.open-api.vn/api" },
    },
    database: {
        host: process.env.DB_HOST || "",
        name: process.env.DB_NAME || "",
        port: process.env.DB_PORT ? +process.env.DB_PORT : 3306,
        username: process.env.DB_USER || "",
        password: process.env.DB_PASSWORD || "",
    },
    appUrl: process.env.APP_URL,

    redis: {
        host: process.env.REDIS_HOST || "",
        port: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379,
    },
};

export const EMAIL_CONFIG = {
    host: process.env.EMAIL_HOST || "",
    port: process.env.EMAIL_PORT ? +process.env.EMAIL_PORT : 465,
    secure: Boolean(process.env.EMAIL_SECURE).valueOf(),
    user: process.env.EMAIL_USER || "",
    password: process.env.EMAIL_PASSWORD || "",
};

export const GOOGLE_CONFIG = {
    clientId: process.env.AUTH_GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET || "",
    recaptchaSecret: process.env.RECAPTCHA_GOOGLE_SECRET || "",
    secretToken: process.env.GOOGLE_SECRET_TOKEN || "",
};

export const FIREBASE_CONFIG = {
    bucket: process.env.FIREBASE_STORE_BUCKET || "",
    projectId: process.env.FIREBASE_PROJECT_ID || "",
    privateKey: process.env.FIREBASE_PRIVATE_KEY || "",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
};
