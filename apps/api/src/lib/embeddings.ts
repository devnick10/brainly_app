// Generate embedding for the searchable text
export const generateEmbedding = async (text: string, AI: Ai) => {
    try {
        const aiResponse = await AI.run(
            "@cf/baai/bge-base-en-v1.5",
            { text: [text] }
        )

        const embedding = (aiResponse as { data: number[][] }).data[0]
        const embeddingStr = `[${embedding.join(',')}]`
        return embeddingStr;
    } catch (error) {
        console.error("Error generating embedding:", error);
    }
}
