import express from 'express';
import { addNewProduct, getProductsByShopId, getAllProducts } from '../controller/productController';
import multer from 'multer';
import path from 'path';


const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        console.log("req", req.body)
        const productTitle = req.body.productTitle
        const fileName = `${productTitle}-${Date.now()}${path.extname(file.originalname)}`
        
        cb(null, fileName)
    }
});

const upload = multer({ storage: storage });


router.post('/add-product/:shopId', upload.fields([{ name: 'productPhoto', maxCount: 1 }, { name: 'productVideo', maxCount: 1 }]), addNewProduct);
router.get('/get-products/:shopId', getProductsByShopId); 
router.get('/get-all-products', getAllProducts); 

export default router;