const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage_novel = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'novel_covers',  // Tên thư mục trên Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],  // Các định dạng hình ảnh được phép
        public_id: (req, file) => 'coverImage-' + Date.now(),  // Tên file ảnh duy nhất
    },
});

const upload_novel = multer({ storage: storage_novel });

const storage_transaction = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'transaction_proofs',  // Tên thư mục trên Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],  // Các định dạng hình ảnh được phép
        public_id: (req, file) => 'proof-' + Date.now(),  // Tên file ảnh duy nhất
    },
});

const upload_transaction = multer({ storage: storage_transaction });


module.exports = { upload_transaction, upload_novel };  
