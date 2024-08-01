import { ChatCompletion } from 'openai/resources/index'
import ChromaDBClient from './chromaDBClient.ts'
import { loadDocuments } from './docs/loadDocuments.ts'
import CustomEmbedding from './embedding/remoteEmbedding.ts'
import { largeLanguageModelChat } from './openai/chat.ts'
import { addPreTrainData } from './common/addPretrainData.ts'
import { recallQuery } from './common/recallQuery.ts'
import { ReadableStream } from "node:stream/web"
import DefaultEmbedding from './embedding/localEmbedding.ts'

const mode = process.argv.slice(2)[0]
if (mode === 'local') {
  // 本地模式，读取模型需要使用ReadableStream，这里要做一个polyfill
  Object.defineProperties(globalThis, {
    ReadableStream: { value: ReadableStream },
  })
}

async function init() {
  // 加载vant文件目录
  const docs = await loadDocuments()
  // 自定义embedding函数
  const embedder = mode === 'local' ? new DefaultEmbedding() : new CustomEmbedding()
  // 初始化向量数据库
  const chromaClient = new ChromaDBClient()
  // 创建和加载集合，将自定义embedding类传入
  await chromaClient.load(embedder, mode)
  return {docs, chromaClient}
}

init().then(
  // 加载vant文档、分片存储向量化到向量数据库
  addPreTrainData
).then(
  // 根据用户查询，搜索向量数据库，根据召回的内容进行提示词模板拼接
  recallQuery
).then(
  // 调用大语言模型生成会话，回答用户问题
  largeLanguageModelChat
).then((completion: ChatCompletion) => {
  // 输出大模型回答
  console.log(completion.choices[0])
})
