import express from "express";
import { checkAndVerifyUserToken } from "../controller/userController";

const routes = express.Router()

routes.get("/", checkAndVerifyUserToken)

export default routes