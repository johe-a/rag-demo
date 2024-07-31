import fs from 'fs/promises'
/**
 * 文件读取器
 */
export class FileReader {
  constructor(private readonly path: string) {
    this.path = path
  }
  async load() {
    try {
      const content = await fs.readFile(this.path, 'utf-8')
      return content
    } catch(e) {
      throw new Error('no such file')
    }
  }
}