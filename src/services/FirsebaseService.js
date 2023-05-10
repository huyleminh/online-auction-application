import admin from "firebase-admin";
import { getStorage } from "firebase-admin/storage";
import { unlink } from "fs";
import { v4 } from "uuid";
import { FIREBASE_CONFIG } from "../config/index.js";

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: FIREBASE_CONFIG.projectId,
        private_key: FIREBASE_CONFIG.privateKey.replace(/\\n/g, "\n"),
        client_email: FIREBASE_CONFIG.clientEmail,
    }),
    storageBucket: FIREBASE_CONFIG.bucket,
});

const AppBucket = getStorage().bucket();

export default class FirsebaseService {
    static uploadSingleImage(imagePath, type) {
        return new Promise(async (resolve, reject) => {
            try {
                const imgId = v4();
                const uploadRes = await AppBucket.upload(imagePath, {
                    destination: `${imgId}.${type}`,
                    metadata: {
                        metadata: {
                            firebaseStorageDownloadTokens: imgId,
                        },
                    },
                });

                unlink(imagePath, (err) => {
                    if (err) {
                        throw err;
                    }
                });

                const metadata = uploadRes[0].metadata;
                const imgURL = `https://firebasestorage.googleapis.com/v0/b/${metadata.bucket}/o/${metadata.name}?alt=media&token=${imgId}`;
                resolve(imgURL);
            } catch (error) {
                reject(error);
            }
        });
    }
}
