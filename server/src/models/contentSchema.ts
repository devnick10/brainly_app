import mongoose, { Schema } from "mongoose";
const contentTypes = ['youtube', 'twitter'];

const contentSchema = new Schema({
    link: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: contentTypes,
        required: true
    },
    tags: [
        {
            type: Schema.Types.ObjectId,
            ref: "tag"
        }
    ],
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
})


const contentModel = mongoose.model("content", contentSchema);
export {
    contentModel,
}