import { Request, Response } from "express";
import { contentModel } from "../models/contentSchema";
import { linkModel } from "../models/linkSchema";
import { random } from "../utils";
import { ApiError } from "../middleware/errorHandler";

const createContent = async (req: Request, res: Response) => {
    const { link, title, type } = req.body;
    const userId = req.userId;
    
    if(!link || !title || !type){
        throw new ApiError("All fields are required",400)
    }

    try {
        await contentModel.create({
            link,
            title,
            type,
            userId,
            tags: []
        })

        res.json({ message: "content added" })
    } catch (error) {
        throw new ApiError("failed to add content", 500)
    }
}

const getContent = async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
        const userContent = await contentModel.find({
            userId
        }).populate('userId', 'email')

        res.json({
            success: true,
            content: userContent
        })
    } catch (error) {
        throw new ApiError("Failed to get content", 500);
    }
}

const deleteContent = async (req: Request, res: Response) => {
    const { contentId } = req.params;
    if(!contentId){
        throw new ApiError("contentId is required",400)
    }

    try {
        const deleteResult = await contentModel.deleteOne({
            _id: contentId,
            userId: req.userId
        })

        if(deleteResult.deletedCount === 0){
            throw new ApiError("Content not found or not authorized", 404);
        }
        res.json({
            success: true,
            message: "content deleted"
        })
    } catch (error) {
        throw new ApiError("content deletion failed", 500)
    }
}

const createShareableLink = async (req: Request, res: Response) => {
    const { share } = req.body;
    const userId = req.userId;

    if (share) {
        const linkExist = await linkModel.findOne({
            userId
        })

        if (linkExist) {
            res.json({
                success: true,
                hash: linkExist.hash
            })
            return
        }

        const hash = random(10);

        await linkModel.create({
            hash,
            userId
        })

        res.json({
            success: true,
            hash
        })
    } else {
        await linkModel.deleteOne({
            userId
        })
        res.json({
            success: true,
            message: "Remove link"
        })
    }
}

const getSharedBrain = async (req: Request, res: Response) => {
    const hash = req.params.sharelink;
    try {
        const link = await linkModel.findOne({
            hash
        })

        if (!link) {
            res.json({
                success: false,
                message: "sorry incorrect inputs"
            })
            return;
        }

        const content = await contentModel.find({
            userId: link.userId
        }).populate("userId", "email")

        res.json({
            success: true,
            content
        })
    } catch (error) {
        throw new ApiError("content not available", 404)
    }
}

export {
    createContent,
    deleteContent,
    getSharedBrain,
    getContent,
    createShareableLink
};
