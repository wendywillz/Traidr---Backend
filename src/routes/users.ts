import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { createUser, createGoogleUser, loginUser, savePayment, changePassword, handleGoogleCallback, getUserShopId, updateUser } from '../controller/userController';


const router = express.Router();

const storage = multer.diskStorage({
destination: function (req, file, cb) {
        const dir = path.resolve(__dirname, '..', '..', 'public','uploads/profilePics')
        try {
            fs.mkdirSync(dir, { recursive: true })
            
        } catch (error) {
            console.log("error", error)
        }
        cb(null, 'public/uploads/profilePics')
    },
    filename: function (req, file, cb) {
        const firstName = req.body.firstName
        const secondName = req.body.firstName
        const fileName = `${firstName}-${secondName}${path.extname(file.originalname)}`
        console.log("fileName", fileName)
        cb(null, fileName)
    }
});

const upload = multer({ storage: storage });

// Endpoint for creating a new user
router.post('/createUser', createUser);

// Endpoint for creating a new user using Google Sign-In
router.post('/createGoogleUser', createGoogleUser);

// Endpoint for handling Google OAuth callback
router.get('/auth/google/callback', handleGoogleCallback);

// Enpoint for making payment
router.post('/save-payment', savePayment);


// Enpoint forchange password
router.post('/change-password', changePassword);

router.get('/get-user-shopId', getUserShopId);
router.post('/login', loginUser);

//Endpoint for updating users
router.post(`/edit-profile`, upload.single('profilePic'), updateUser)

export default router;
