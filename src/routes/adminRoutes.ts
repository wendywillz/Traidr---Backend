import express from "express";

import { getAllUsersGender } from "../controller/adminController";

const router = express.Router();


router.get('/user-analytics/gender', getAllUsersGender)

export default router;