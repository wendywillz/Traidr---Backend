"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const router = express_1.default.Router();
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
router.post('/login', userController_1.loginUser);
exports.default = router;
