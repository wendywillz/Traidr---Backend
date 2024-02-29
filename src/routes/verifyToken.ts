import express from "express";
import { checkAndVerifyUserToken } from "../controller/userController";

const routes = express.Router()

routes.post("/", checkAndVerifyUserToken)

export default routes