import type { AIBinding } from "./types";

export async function generateEmbedding(
    text: string,
    ai: AIBinding
) {
    const response = await ai.run(
        "@cf/baai/bge-base-en-v1.5",
        {
            text: [text],
        }
    );

    return response.data[0];
}