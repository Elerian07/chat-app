import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as messageController from "./controller/messages.controller.js"
const router = Router()

router.get("/", auth(), messageController.getAll)
router.post("/", auth(), messageController.addMessage)



export default router
