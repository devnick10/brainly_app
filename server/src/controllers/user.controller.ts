import { Request, Response } from "express";
import { userModel } from "../models/userSchema";
import jwt from "jsonwebtoken";
import { ApiError } from "../middleware/errorHandler";
import { config } from "../config/config";
import { signinSchema, signupSchema } from "../schema/userSchema";

const signup = async (req: Request, res: Response) => {
    const { data, success } = signupSchema.safeParse(req.body);
    if (!success) {
        throw new ApiError("All fields are required", 400)
    }

    const { email, password } = data;
    try {
        const user = await userModel.create({
            email,
            password
        })
        const token = jwt.sign({ id: user.id }, config.get("JWT_SECRET"), { expiresIn: '12h' })
        res.json({
            success: true,
            message: "Singup successfully.",
            token
        })
    } catch (error) {
        console.error(error);
        throw new ApiError("User allready signup.", 409);
    }
}

const signin = async (req: Request, res: Response) => {
    const { data, success } = signinSchema.safeParse(req.body);
    if (!success) {
        throw new ApiError("All fields are required", 400)
    }

    const { email, password } = data;
    const userExist = await userModel.findOne({
        email,
        password
    })
    if (userExist) {
        const token = jwt.sign({ id: userExist.id }, config.get("JWT_SECRET"), { expiresIn: '1hr' })
        res.json({
            success: true,
            message: "Signin successfully",
            token
        })
    } else {
        throw new ApiError("Incorrect credentials", 401)
    }
}

export {
    signup,
    signin
}