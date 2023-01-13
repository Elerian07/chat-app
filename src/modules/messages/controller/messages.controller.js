import { create, find, findById, findByIdAndUpdate, findOne, findOneAndUpdate } from "../../../../DB/DBMEthods.js"
import messageModel from "../../../../DB/model/messageModel.js"
import { asyncHandler } from "../../../service/asyncHandler.js"

export const getAll = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const allMessages = await find({ model: messageModel, condition: { _id: id } })
    if (allMessages) {

        return res.status(200).json({ message: "Done", allMessages })
    } else {
        return next(new Error("something went wrong please try again later", { cause: 500 }))
    }
})

export const getAllChats = asyncHandler(async (req, res, next) => {
    const allChats = await find({ model: messageModel })
    if (allChats) {

        return res.status(200).json({ message: "Done", allChats })
    } else {
        return next(new Error("something went wrong please try again later", { cause: 500 }))
    }
})
export const addMessage = asyncHandler(async (req, res, next) => {
    let { content, receivedBy } = req.body;

    if (!content) { return next(new Error("you can't send an empty message", { cause: 400 })) }

    let existChat = await findOne({ model: messageModel, condition: { $and: [{ sentBy: req.user._id }, { receivedBy }] } });


    if (existChat) {

        let newMessage = await findOneAndUpdate({
            model: messageModel,
            condition: existChat._id,
            data: { $push: { content } },
            options: { new: true }
        })
        return res.status(200).json({ message: "sent", newMessage });

    } else {
        const message = await create({ model: messageModel, data: { content, sentBy: req.user._id, receivedBy } });
        if (!message.content) {
            return next(new Error("you can't send an empty message", { cause: 400 }))
        }
        if (message) {

            return res.status(200).json({ message: "sent", message })
        }
        return next(new Error("something went wrong please try again later", { cause: 500 }))
    }
})