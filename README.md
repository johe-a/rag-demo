## RAG-demo

RAG的一个最简单实现DEMO，支持本地和远程模型向量化。具体查看文档


## 使用说明

1. 安装依赖

   ```shell
   pnpm i
   ```
2. 执行 `pnpm run start:chroma` 在后台启动 `chroma` 向量数据库
3. 打开 `.env` 文件，设置自己的 `OPENAI_URL`和  `OPENAI_KEY`
4. 根据本地和远程的需求，执行不同的命令

   - `pnpm run local` 执行本地模型向量化
   - `pnpm run remote` 执行ChatGPT模型向量化

注意！在切换本地和远程的时候，需要执行 `sudo pnpm clean` 删除 `chroma` 数据库再执行。这是由于使用的向量化函数不同，输出的向量维度也不一样。当插入向量维度不一样的向量数据时，`chroma` 会报 ` invalidDimension` 的错误。


## 目录结构

```shell
- chroma chroma数据库存放数据的文件夹
- pretrained-model 存放本地向量化模型
- vant 预训练的数据vant的Markdown文档
- .env 环境变量，存放openai的url和key
- src
  - docs 处理预训练数据相关的函数
    - extractDirectoryFiles 提取目标文件夹的目标文件路径
    - fileReader 文件读取器类，用于读取文件
    - loadDocuments 加载预训练数据并分块
    - splitChunks 分块数据
  - embedding 自定义的向量化函数类
    - localEmbedding 调用本地模型的向量化函数类
    - remoteEmbedding 调用远程模型的向量化函数类
  - openai openai相关的处理
    - chat 创建openai动画
    - generateTemplate 根据用户查询和召回文档生成prompt
    - openAI openai实例
  - common 公共逻辑
    - addPretrainData 往向量数据库添加预训练数据
    - recallQuery 根据用户查询召回文档并生成prompt
  - chromaDBClient.ts Chroma客户端的增删查改类
  - index.ts 入口文件
  - interface.ts 类型声明
```
