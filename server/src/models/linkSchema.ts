import mongoose, { Schema } from "mongoose";

const linkSchema = new Schema({
    hash: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
})

const linkModel = mongoose.model("link", linkSchema);

export {
    linkModel
}