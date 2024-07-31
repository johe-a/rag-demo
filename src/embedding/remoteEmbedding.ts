import { DefaultEmbeddingFunction } from "chromadb"
import openai from "../openai/openAI.ts"

export default class CustomEmbedding extends DefaultEmbeddingFunction {
  async generate(texts: string[]): Promise<number[][]> {
    // 远程调用openai的embedding能力，将文本转化为向量
    const embedding = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: texts
    })
    const data = embedding.data.map(item => item.embedding)
    return data
  }
}