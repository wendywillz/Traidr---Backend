import express from 'express';
import { addNewProduct, getProductsByShopId, getAllProducts } from '../controller/productController';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.resolve(__dirname, '..', '..', 'public','uploads')
        try {
            fs.mkdirSync(dir, { recursive: true })
            console.log("dir", dir)
        } catch (error) {
            console.log("error", error)
        }
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        const productTitle = req.body.productTitle
        const fileName = `${productTitle}-${Date.now()}${path.extname(file.originalname)}`
        
        cb(null, fileName)
    }
});

const upload = multer({ storage: storage });


router.post('/add-product/:shopId', upload.fields([{ name: 'productPhoto', maxCount: 3 }, { name: 'productVideo', maxCount: 1 }]), addNewProduct);
router.get('/get-products/:shopId', getProductsByShopId); 
router.get('/get-all-products', getAllProducts); 

export default router;