import { ChromaClient, Collection, IEmbeddingFunction, IncludeEnum } from "chromadb"

export default class ChromaDBClient {
  client: ChromaClient
  collection: Collection
  constructor() {
    this.client = new ChromaClient()
  }
  async load(embedder: IEmbeddingFunction, mode: string) {
    this.collection = await this.client.getOrCreateCollection({
      name: `${mode}_collection`,
      embeddingFunction: embedder
    })
  }
  async add(documents: string[]) {
    await this.collection.add({
      documents,
      ids: documents.map((str, index) => str.slice(0, 2) + index)
    })
  }
  async query(text: string, topK: number) {
    const results = await this.collection.query({
      queryTexts: [text],
      nResults: topK, // 召回的数量，返回两个最相关的结果
    })
    console.log('results', results)
    return results.documents[0]
  }
  async getTopCollection(limit: number) {
    return await this.collection.get({
      limit,
      include: [IncludeEnum.Embeddings, IncludeEnum.Documents]
    })
  }
}