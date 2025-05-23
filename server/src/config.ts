const JWT_SECRET = process.env.JWT_SECRET
const FRONDEND_URL = process.env.FRONDEND_URL
const DATABASE_URL = process.env.DATABASE_URL
const PORT = process.env.PORT

export function verifyEnvironmentVariables() {
    if (!JWT_SECRET) {
        throw new Error("Plz provied JWT_SECRET")
    }
    if (!FRONDEND_URL) {
        throw new Error("Plz provied FRONTEND_URL")
    }
    if (!DATABASE_URL) {
        throw new Error("Plz provied DATABASE_URL")
    }
    if (!PORT) {
        throw new Error("Plz provied PORT")
    }
}

export {
    JWT_SECRET,
    FRONDEND_URL,
    DATABASE_URL,
    PORT
}