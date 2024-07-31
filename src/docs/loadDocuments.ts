import path from "node:path";
import { fileURLToPath } from "node:url";
import extractFiles from "./extractDirectoryFiles.ts";
import { FileReader } from "./fileReader.ts";
import { splitChunks } from "./splitChunks.ts";

/**
 * 读取Vant目录下的所有markdown文件
 */
export async function loadDocuments() {
  const __filename = fileURLToPath(import.meta.url); 
  const __dirname = path.dirname(__filename);
  // 从zand文件夹里递归读取所有的markdown文件路径
  const files = await extractFiles(path.resolve(__dirname, '../../vant'), 'md')
  // 将对应路径的文件生成文件读取器
  const fileReaders = files.map(filepath => new FileReader(filepath))
  // 读取文件内容
  const docs = await Promise.all(fileReaders.map(async (curFileReader) => await curFileReader.load()))
  // 拆分文件内容为chunks
  const chunks = docs.reduce<Array<string[]>>((acc, doc) => {
    // 最大size为500
    acc.push(splitChunks(doc, 500))
    return acc
  }, [])
  return chunks
}
