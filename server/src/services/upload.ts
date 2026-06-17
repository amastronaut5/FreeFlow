import multer from "multer";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file.originalname);
        console.log(file.mimetype);
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
export const upload = multer({ storage });