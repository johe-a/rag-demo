import { HandlerParams } from "src/interface";
import openai from "./openAI.ts";

/**
 * 大语言模型会话
 * @param params 
 */
export const largeLanguageModelChat = async (params: HandlerParams & {template: string}) => {
  const { template } = params;
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        "role": "system",
        "content": "你是一个专业的前端领域知识库的客服，负责回答用户对于知识库的疑问"
      },
      {
        "role": "user",
        "content": template,
      }
    ]
  })
  return completion
}