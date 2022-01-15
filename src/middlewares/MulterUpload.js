import multer from "multer";
import { dirname } from "path";
import { fileURLToPath } from "url";

// const __dirname = dirname(fileURLToPath(import.meta.url)).replace("/src/middlewares", "");
const __dirname = dirname(fileURLToPath(import.meta.url)).replace("\\src\\middlewares", "");

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            cb(null, `${__dirname}/public/uploads`);
        } catch (error) {
            console.log("Error:", error);
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + Math.round(Math.random() * 1e9) + `.${file.mimetype.split("/")[1]}`);
    },
});

const diskUpload = multer({
    storage: diskStorage,
    fileFilter: function (req, file, cb) {
        try {
            if ([...file.mimetype.matchAll(/^(image\/)\w*/g)].length !== 0) {
                cb(null, true);
            } else {
                cb(null, false);
            }
        } catch (err) {
            console.log("Error:", err);
        }
    },
});

export { diskUpload as ImageDiskUpload };
