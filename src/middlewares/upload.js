const multer = require('multer');
const path = require('path');

const storage_transaction = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'public', 'images','transactions'));
    },
    filename: (req, file, cb) => {
        const uniqueName = `proof-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload_transaction = multer({ storage: storage_transaction });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'images', 'novel'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, 'coverImage-' + uniqueSuffix);
    }
});
const upload = multer({ storage: storage });

module.exports = {upload_transaction,upload};   
