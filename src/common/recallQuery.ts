import { Handler } from "src/interface"
import { generateTemplate } from "../openai/generateTemplate.ts"
import { input } from "@inquirer/prompts"

/**
 * 根据用户查询召回生成提示词
 * @param params 
 * @returns 
 */
export const recallQuery: Handler<{template: string}> = async (params) => {
  const query = await input({message: "请输入您的疑问"});
  const { chromaClient } = params
  // 这里召回数量设置为5条
  const documents = await chromaClient.query(query, 5)
  const template = await generateTemplate(documents, query)
  console.log('召回后的提示词', template)
  return {
    ...params,
    template
  }
}

