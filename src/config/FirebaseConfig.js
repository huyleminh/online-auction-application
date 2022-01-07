import dotenv from "dotenv";

dotenv.config();

export default class FirebaseConfig {
    static get BUCKET() {
        return process.env.FIREBASE_STORE_BUCKET;
    }
}
