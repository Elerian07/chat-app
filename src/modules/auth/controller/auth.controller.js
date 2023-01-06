import userModel from '../../../../DB/model/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../../service/sendEmail.js';
import { asyncHandler } from '../../../service/asyncHandler.js';
import { findOne, create, findById, findByIdAndUpdate, findOneAndUpdate } from '../../../../DB/DBMethods.js';


export const signUp = asyncHandler(async (req, res, next) => {
    const { userName, email, password, cPassword } = req.body;
    if (password == cPassword) {
        let user = await findOne({ model: userModel, condition: { email }, select: "email" });
        if (user) {
            return next(new Error("this email already register", { cause: 409 }))
        } else {
            let hashed = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));
            let addUser = new userModel({ userName, email, password: hashed });


            let token = jwt.sign({ id: addUser._id, isLoggedIn: true }, process.env.emailToken, { expiresIn: '1h' })
            let refreshToken = jwt.sign({ id: addUser._id, isLoggedIn: true }, process.env.refreshEmailToken, { expiresIn: 60 * 60 * 24 })
            let link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}auth/confirmEmail/${token}`
            let refreshLink = `${req.protocol}://${req.headers.host}${process.env.BASEURL}auth/refreshToken/${refreshToken}`
            let message = `please click here to verify your email <a href="${link}">here</a>
            <br/>
            if this link expired please click here to get a new link <a href = "${refreshLink}">here</a>`
            let result = await sendEmail(email, 'confirm to register', message);
            if (result.accepted.length) {
                let saved = await create({ model: userModel, data: addUser });
                return res.status(201).json({ message: "Added", saved })
            } else {
                return next(new Error("invalid Email", { cause: 404 }))

            }
        }
    } else {
        return next(new Error("password and cPassword doesn't match", { cause: 400 }))

    }
})

export const confirmEmail = asyncHandler(async (req, res, next) => {

    let { token } = req.params;
    let decoded = jwt.verify(token, process.env.emailToken);
    if (!decoded && !decoded.id) {
        next(new Error("invalid token", { cause: 400 }))
    } else {

        let user = await findById({ model: userModel, condition: { _id: decoded.id, confirmEmail: false } })
        if (user) {
            if (confirmEmail != true) {
                let updated = await findByIdAndUpdate({ model: userModel, condition: { _id: decoded.id }, data: { confirmEmail: true }, options: { new: true } })
                return res.status(200).json({ message: "confirmed", updated })
            } else {
                return next(new Error("you are already confirmed", { cause: 400 }))
            }
        } else {
            return next(new Error("you have to register first", { cause: 404 }))
        }

    }
})

export const refresh = asyncHandler(async (req, res, next) => {

    let { token } = req.params;
    let decoded = jwt.verify(token, process.env.emailToken)
    if (!decoded && !decoded.id) {
        return next(new Error("invalid token or id", { cause: 400 }))
    } else {
        let user = await findById({ model: userModel, condition: decoded.id })
        if (user) {
            if (user.confirmEmail) {
                return next(new Error("this email is confirmed", { cause: 409 }))
            } else {
                let token = jwt.sign(user._id.toJSON(), process.env.emailToken)
                let link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}>here</a>`
                let message = `please click <a href = ${link}></a>  to verify your email `
                sendEmail(user.email, 'confirm to register', message)
                return res.status(200).json({ message: "please check your email" });
            }
        } else {
            return next(new Error("user didn't register", { cause: 404 }))
        }
    }

})

export const login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;
    let user = await findOne({ model: userModel, condition: { email } });
    if (!user) {
        return next(new Error("invalid Email", { cause: 404 }))
    } else {
        let match = bcrypt.compareSync(password, user.password)
        if (match) {
            if (!user.confirmEmail) {
                return next(new Error("you need to confirm your email first", { cause: 400 }))
            } else {
                const token = jwt.sign({ id: user._id, isLoggedIn: true }, process.env.tokenSignature)
                let active = await findByIdAndUpdate({ model: userModel, condition: user._id, data: { activeStatus: true } })
                return res.status(200).json({ message: "welcome, you are signed in ", token })
            }
        } else {
            return next(new Error("incorrect password", { cause: 400 }))
        }
    }

})

export const logout = asyncHandler(async (req, res, next) => {
    let user = await findOne({
        model: userModel, condition: { activeStatus: true }
    })
    if (user) {
        let token = jwt.sign({ id: user._id, isLoggedIn: false }, process.env.tokenSignature)
        let active = await findByIdAndUpdate({ model: userModel, condition: user._id, data: { activeStatus: false } })
        return res.status(200).json({ message: "you are signed out" })
    } else {
        return next(new Error("you have to login first", { cause: 404 }))
    }
})