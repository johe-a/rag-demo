import ChromaDBClient from "./chromaDBClient"

export type HandlerParams = {
  docs: string[][],
  chromaClient: ChromaDBClient
}

export interface Handler<T = {}> {
  (value: HandlerParams): Promise<HandlerParams & T>
}
