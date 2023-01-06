import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as authController from "./controller/auth.controller.js"
const router = Router()


router.post("/signup", authController.signUp)
router.post("/login", authController.login)
router.get("/confirmEmail/:token", authController.confirmEmail)
router.get("/refreshToken/:token", authController.refresh)
router.post("/logout", auth(), authController.logout)



export default router