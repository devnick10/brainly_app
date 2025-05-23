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

const tagSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    }
})
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

const userModel = mongoose.model("user", userSchema);
const contentModel = mongoose.model("content", contentSchema);
const tagModel = mongoose.model("tag", tagSchema);
const linkModel = mongoose.model("link", linkSchema);

export {
    userModel,
    contentModel,
    tagModel,
    linkModel
}