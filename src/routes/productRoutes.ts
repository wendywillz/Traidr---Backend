import express from 'express';
import { addNewProduct } from '../controller/productController';
import multer from 'multer';
import path from 'path';


const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        const productTitle = req.body.productTitle
        const fileName = `${productTitle}-${Date.now()}${path.extname(file.originalname)}`
        
        cb(null, fileName)
    }
});

const upload = multer({ storage: storage });


router.post('/add-product', upload.fields([{ name: 'productPhoto', maxCount: 1 }, { name: 'productVideo', maxCount: 1 }]), addNewProduct);
 
export default router;