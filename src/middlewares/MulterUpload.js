import multer from "multer";
import { dirname } from "path";
import { fileURLToPath } from "url";

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
        cb(null, file.originalname);
    },
});

const diskUpload = multer({ storage: diskStorage });

export { diskUpload as ImageDiskUpload };
