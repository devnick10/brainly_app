// Generate embedding for the searchable text
const generateEmbedding = async (text: string, AI: Ai) => {
    const aiResponse = await AI.run(
        "@cf/baai/bge-base-en-v1.5",
        { text: [text] }
    )

    const embedding = (aiResponse as { data: number[][] }).data[0]
    const embeddingStr = `[${embedding.join(',')}]`
    return embeddingStr;
}
