const multer = require('multer');
const path = require('path');

const destination = path.resolve('temp');
console.log(destination)

const storage = multer.diskStorage({
    destination,
    filename: (req, file, cb) => {
        const uniquePreffix = `${Date.now()}_${Math.round(Math.random() * 1E9)}`;
        const filename = `${uniquePreffix}_${file.originalname}`;
        cb(null, filename);
    }
})

const limits = {
    fileSize: 5 * 1024 * 1024
}

const upload = multer({
    storage, 
    limits,
})

module.exports = upload;