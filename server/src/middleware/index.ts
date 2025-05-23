import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];
    const decode = jwt.verify(token as string, `${JWT_SECRET}`) as JwtPayload;

    if (decode) {
        req.userId = decode.id;
        next();
    } else {
        res.json({
            message: "You are not logged in"
        })
    }
}