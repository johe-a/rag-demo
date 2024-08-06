export async function generateTemplate(docs: string[], query: string) {
  const context = docs.map((doc, index) => {
    return `${index+1}: ${doc.trim()}`
  }).join('\n')
  return `
    已知信息：
    '''${context}'''
    
    根据和结合上述已知信息，专业的回答用户问题，如果是使用说明，请给出示例，如果根据上述已知信息获取不到答案，回复"根据已知信息无法获取答案"，不允许在答案中添加编造成分，答案请使用中文。
    问题是'''${query}'''`
}