import { Request, Response } from "express";
import { userModel } from "../models/userSchema";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { ApiError } from "../middleware/errorHandler";

const signup =  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.create({
            email,
            password
        })
        const token = jwt.sign({ id: user.id }, JWT_SECRET as string,{expiresIn:'12h'})
        res.json({
            success:true,
            message: "Singup successfully.",
            token
        })
    } catch (error) {
        console.error(error);
        throw new ApiError("User allready signup.",409);
    }
}

const signin = async (req:Request, res:Response) => {
    const { email, password } = req.body;

    const userExist = await userModel.findOne({
        email,
        password
    })
    if (userExist) {
        const token = jwt.sign({ id: userExist.id }, JWT_SECRET as string,{expiresIn:'1hr'})
        res.json({
            success:true,
            message:"Signin successfully",
            token
        })
    } else {
        throw new ApiError("Incorrect credentials",401)
    }
}

export {
    signup,
    signin
}