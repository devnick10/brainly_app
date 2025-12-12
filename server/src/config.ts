import dotenv from 'dotenv';
dotenv.config()

const _config: { [key: string]: string | undefined } = {
    JWT_SECRET: process.env.JWT_SECRET,
    FRONDEND_URL: process.env.FRONDEND_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
}

export const config = {
    get: (key: string) => {
        const value = _config[key];
        if (!value) {
            console.error(
                `The ${key} variable not found, Make sure to pass envorinment variables!`
            );
            process.exit();
        }
        return value;
    },
};