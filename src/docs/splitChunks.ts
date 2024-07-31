/**
 * 拆分文件内容，将其分成一个个最大size为chunkSize的块
 * @param {string} text 原始文本
 * @param {number} chunkSize 分片大小
 * @returns 
 */
export function splitChunks(text: string, chunkSize: number) {
  const chunks: string[] = [];
  let docSize = 0;
  let tmp: string[] = [];
  text.split("\n").forEach(line => {
    line = line.trim();
    if (line.length + docSize < chunkSize) {
      tmp.push(line);
      docSize += line.length;
    } else {
      chunks.push(tmp.join("\n"));
      tmp = [line];
      docSize = line.length;
    }
  });

  // 添加最后一个块（如果存在）
  if (tmp.length > 0) {
    chunks.push(tmp.join("\n"));
  }

  return chunks;
}