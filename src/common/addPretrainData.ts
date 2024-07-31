import { Handler } from "src/interface"

/**
 * 加载预训练文档
 * @param params 
 * @returns 
 */
export const addPreTrainData: Handler = async (params) => {
  const { docs, chromaClient} = params
  const addPromise = docs.map(async (documents) => {
    await chromaClient.add(documents)
  })
  await Promise.all(addPromise)
  return params
}
