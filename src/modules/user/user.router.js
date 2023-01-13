import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as userController from './controller/user.controller.js';
import { myMulter, fileValidation, HME } from '../../service/multer.js';

const router = Router()




router.get('/', (req, res) => {
    res.status(200).json({ message: "User Module" })
})

router.post("/changePass", auth(), userController.changePassword)
router.delete("/deleteUser/:id", auth(), userController.deleteById)
router.put("/updateUser", auth(), myMulter(fileValidation.image).single("image"), HME, userController.updateUser)
router.put("/profilePic", auth(), myMulter(fileValidation.image).single("image"), HME, userController.profilePic)
router.put("/friendRequest/:id", auth(), userController.friendRequest)
router.get("/profile/:id", auth(), userController.getProfile)
router.get("/search", auth(), userController.searchUsers)
router.patch("/accFriendRequest/:id", auth(), userController.acceptFriend)
router.patch("/rejFriendRequest/:id", auth(), userController.rejFriendReq)



export default router