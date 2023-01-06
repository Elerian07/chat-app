import userModel from '../../../../DB/model/user.model.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../../../service/cloudinary.js';
import { deleteMany, find, findById, findByIdAndDelete, findByIdAndUpdate, findOne } from '../../../../DB/DBMethods.js';
import { asyncHandler } from '../../../service/asyncHandler.js';



//rest password 
export const changePassword = asyncHandler(async (req, res, next) => {

    let { currentPassword, newPassword, newCPassword } = req.body;
    if (newPassword == newCPassword) {
        let user = await findById({ model: userModel, condition: req.user._id });
        if (!user) {
            return next(new Error('User not found', { cause: 404 }));
        }
        const matched = await bcrypt.compare(currentPassword, user.password);
        if (matched) {
            const hash = await bcrypt.hashSync(newPassword, parseInt(process.env.SALTROUND));
            let updatedUser = await findByIdAndUpdate({ model: userModel, condition: req.user._id, data: { password: hash }, options: { new: true } })
            return res.status(202).json({ message: "Updated", updatedUser })
        } else {
            return next(new Error("current password invalid", { cause: 406 }))
        }

    } else {
        return next(new Error("new Password and new cPassword didn't match", { cause: 406 }))
    }
})
//permanent delete of a user  
export const deleteById = asyncHandler(async (req, res, next) => {
    let { id } = req.params;
    const deleteUser = await findByIdAndDelete({ model: userModel, condition: { _id: id } });

    if (!deleteUser) {
        return next(new Error("user not found", { cause: 404 }))
    } else {
        await cloudinary.uploader.destroy(deleteUser.public_id)

        return res.status(200).json({ message: "deleted", deleteUser });
    }
})
//update
export const updateUser = asyncHandler(async (req, res, next) => {
    let { name } = req.body;
    const user = await findById({ model: userModel, condition: req.user._id });
    if (!user) {
        return next(new Error("user not found", { cause: 404 }));
    } else {
        let imgUrl = "";
        let publicImgId = "";
        if (req.file) {
            await cloudinary.uploader.destroy(user.public_id)

            let { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: "User" });
            imgUrl = secure_url;
            publicImgId = public_id;

        } else {
            imgUrl = user.image;
            publicImgId = user.public_id;
        }
        let updatedUser = await findByIdAndUpdate({
            model: userModel, condition: req.user._id,
            data: { userName: name, image: imgUrl, public_id: publicImgId },
            options: { new: true }
        });
        return res.status(200).json({ message: "updated", updatedUser })
    }
})

//profile pic

export const profilePic = asyncHandler(async (req, res, next) => {
    const user = await findById({ model: userModel, condition: req.user._id });
    let imgUrl = "";
    let publicImgId = "";
    if (!user) {
        return next(new Error("user not found", { cause: 404 }));
    } else {
        if (req.file) {
            await cloudinary.uploader.destroy(user.public_id)
            let { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: "User" });
            imgUrl = secure_url;
            publicImgId = public_id;
        } else {
            return next(new Error("file not found", { cause: 404 }));

        }

    }
    let updatedUser = await findByIdAndUpdate({
        model: userModel,
        condition: req.user._id,
        data: { image: imgUrl, public_id: publicImgId },
        options: { new: true }
    })
    return res.status(200).json({ message: "Added Profile Picture", updatedUser })
})

//get profile

export const getProfile = asyncHandler(async (req, res, next) => {
    let { id } = req.params
    const populate = [
        {
            path: "userName"

        },
        {
            path: "email"

        },
        {
            path: "image"

        }
    ]
    if (id === req.user.id) {

        const user = await findById({ model: userModel, condition: req.user._id });
        if (!user) {
            return next(new Error("user not found", { cause: 404 }));
        } else {
            let ownerProfile = await findById({ model: userModel, condition: req.user._id, select: user.id, populate: [...populate] });

            return res.status(200).json({ message: "Done", ownerProfile })
        }
    } else {
        const user = await findById({ model: userModel, condition: { _id: id } });
        if (!user) {
            return next(new Error("user not found", { cause: 404 }));
        } else {
            let profile = await find({ model: userModel, condition: { _id: id }, select: user.userName, populate: [...populate] });

            return res.status(200).json({ message: "Done", profile })
        }
    }

})
