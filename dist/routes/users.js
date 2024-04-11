"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const userController_1 = require("../controller/userController");
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const dir = path_1.default.resolve(__dirname, '..', '..', 'public', 'uploads/profilePics');
        try {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        catch (error) {
            console.log("error", error);
        }
        cb(null, 'public/uploads/profilePics');
    },
    filename: function (req, file, cb) {
        const firstName = req.body.firstName;
        const secondName = req.body.firstName;
        const fileName = `${firstName}-${secondName}${path_1.default.extname(file.originalname)}`;
        console.log("fileName", fileName);
        cb(null, fileName);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
// Endpoint for creating a new user
router.post('/createUser', userController_1.createUser);
// Endpoint for creating a new user using Google Sign-In
router.post('/createGoogleUser', userController_1.createGoogleUser);
// Endpoint for handling Google OAuth callback
router.get('/auth/google/callback', userController_1.handleGoogleCallback);
// Enpoint for making payment
router.post('/save-payment', userController_1.savePayment);
// Enpoint forchange password
router.post('/change-password', userController_1.changePassword);
router.get('/get-user-shopId', userController_1.getUserShopId);
router.post('/login', userController_1.loginUser);
//Endpoint for updating users
router.post(`/edit-profile`, upload.single('profilePic'), userController_1.updateUser);
exports.default = router;
