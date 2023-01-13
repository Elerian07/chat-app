import { Schema, model, Types } from "mongoose";


const userSchema = new Schema({

    userName: {
        type: String,
        required: [true, 'userName is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char']

    },
    email: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'userName is required'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    activeStatus: {
        type: Boolean,
        default: false,
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    blocked: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String
    },
    public_id: {
        type: String
    },
    friends: [{
        type: Types.ObjectId,
        ref: "User"
    }],
    friendRequests: [{
        type: Types.ObjectId,
        ref: "User"

    }],
    sentRequests: [{
        type: Types.ObjectId,
        ref: "User"
    }]
}, {
    timestamps: true
})


const userModel = model('User', userSchema)
export default userModel