import OpenAI from "openai"
import { config } from "dotenv"
import { fileURLToPath } from "node:url";
import path from "node:path";
const __filename = fileURLToPath(import.meta.url); 

config({
  path: path.resolve(__filename, '../../../.env')
})

const openai = new OpenAI({
  baseURL: process.env.OEPNAI_URL,
  apiKey: process.env.OPENAI_KEY
})

export default openai