import dotenv from 'dotenv';
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET
const FRONDEND_URL = process.env.FRONDEND_URL
const DATABASE_URL = process.env.DATABASE_URL
const PORT = process.env.PORT
const NODE_ENV = process.env.NODE_ENV

export function verifyEnvironmentVariables() {
    if (!JWT_SECRET || !FRONDEND_URL || !DATABASE_URL || !PORT || !NODE_ENV) {
        throw new Error("All Environment variabled required")
    }
}

export {
    JWT_SECRET,
    FRONDEND_URL,
    DATABASE_URL,
    PORT,
    NODE_ENV
}