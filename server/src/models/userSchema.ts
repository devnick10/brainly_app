import mongoose, { Schema } from "mongoose";
const contentTypes = ['youtube', 'twitter'];

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})



const tagSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    }
})


const userModel = mongoose.model("user", userSchema);
const tagModel = mongoose.model("tag", tagSchema);

export {
    userModel,
    tagModel,
}