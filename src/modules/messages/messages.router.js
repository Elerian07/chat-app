import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as messageController from "./controller/messages.controller.js"
const router = Router()

router.get("/msg/:id", auth(), messageController.getAll)
router.post("/", auth(), messageController.addMessage)
router.get("/chats", auth(), messageController.getAllChats)



export default router
