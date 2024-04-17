import express from "express";
import { createNewShop, getShopById, getShopOwnerByShopId, changeShopLogo } from "../controller/shopController";
import multer from "multer";
import path from "path";
import fs from "fs"
const router = express.Router();
const storage = multer.diskStorage({
destination: function (req, file, cb) {
        const dir = path.resolve(__dirname, '..', '..', 'public','uploads/shopLogo')
        try {
            fs.mkdirSync(dir, { recursive: true })
            
        } catch (error) {
            console.log("error", error)
        }
        cb(null, 'public/uploads/shopLogo')
    },
    filename: function (req, file, cb) {
    // Use the shopName from the form data to set the file name
        const shopName = req.body.shopName;
        console.log("shopName", shopName)
    cb(null, `${shopName}-${Date.now()}-${file.originalname}`);
 },
});

const upload = multer({ storage: storage });

router.post("/create-shop", createNewShop);
router.get("/get-shop/:shopId", getShopById);
router.get("/get-shop-owner/:shopId", getShopOwnerByShopId)
router.post("/change-shop-logo", upload.single("shopLogo"), changeShopLogo)


export default router;