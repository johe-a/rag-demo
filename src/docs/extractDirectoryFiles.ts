import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * 从文件夹中递归提取符合extension后缀的文件名
 * @param directoryPath 
 * @param extension 
 * @returns 
 */
export default async function extractFiles(directoryPath: string, extension: string) {
  const filenames = await fs.readdir(directoryPath)
  const files: string[] = []
  for (let filename of filenames) {
    const filepath = path.join(directoryPath, filename)
    const fileStats = await fs.stat(filepath)
    if (fileStats.isDirectory()) {
      files.push(...await extractFiles(filepath, extension))
    } else if(filename.indexOf(extension) > 0) {
      files.push(path.resolve(directoryPath, filename))
    }
  }
  return files
}
