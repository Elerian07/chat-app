import { Schema, model, Types } from "mongoose";


const messageSchema = new Schema({
    content: [{
        type: String,
        min: [2, 'product name minimum length 2 char'],
        max: [500, 'product name max length 2 char']

    }],
    sentBy: {
        type: Types.ObjectId,
        ref: "User",
        required: [true, 'addBy is required']
    },
    receivedBy: {
        type: Types.ObjectId,
        ref: "User",
        required: [true, 'addBy is required']
    }

}, {
    timestamps: true
})


const messageModel = model('Message', messageSchema)
export default messageModel