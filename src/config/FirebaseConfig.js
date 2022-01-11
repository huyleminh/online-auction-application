import dotenv from "dotenv";

dotenv.config();

export default class FirebaseConfig {
    static get BUCKET() {
        return process.env.FIREBASE_STORE_BUCKET;
    }

    static get PROJECT_ID() {
        return process.env.FIREBASE_PROJECT_ID;
    }

    static get PRIVATE_KEY() {
        return process.env.FIREBASE_PRIVATE_KEY;
    }

    static get CLIENT_EMAIL() {
        return process.env.FIREBASE_CLIENT_EMAIL;
    }
}
