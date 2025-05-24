import mongoose, { Schema } from "mongoose";

const tagSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    }
})

const tagModel = mongoose.model("tag", tagSchema);

export {
    tagModel,
}