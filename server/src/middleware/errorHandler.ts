import { NextFunction, Request, Response } from "express";
import { config } from "../config/config";

export class ApiError extends Error {
    public isOperational: boolean;
    constructor(message: string, public statusCode: number) {
        super(message)
        this.statusCode
        this.stack
        this.isOperational = true
    }
}


export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    if (config.get("NODE_ENV") === "development") {
        res.status(err.statusCode || 500).json({
            message: err.message || "Internal server error",
            success: false,
            stack: err.stack || ""
        })
        return;
    } else {
        if (err.isOperational) {
            res.status(err.statusCode || 500).json({
                message: err.message || "Internal server error",
                success: false,
            })
        }else{
            console.error(err)
            res.status(err.statusCode || 500).json({
                message: err.message || "Internal server error",
                success: false,
            })
        }
    }
}