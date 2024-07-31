import { IEmbeddingFunction } from "chromadb";
import path from "node:path";
import { fileURLToPath } from "node:url";

export default class DefaultEmbedding implements IEmbeddingFunction {
  private pipelinePromise?: Promise<any> | null;
  private model: string;
  private revision: string;
  private quantized: boolean;
  private progress_callback: Function | null;

  /**
   * DefaultEmbeddingFunction constructor.
   * @param options The configuration options.
   * @param options.model The model to use to calculate embeddings. Defaults to 'Xenova/all-MiniLM-L6-v2', which is an ONNX port of `sentence-transformers/all-MiniLM-L6-v2`.
   * @param options.revision The specific model version to use (can be a branch, tag name, or commit id). Defaults to 'main'.
   * @param options.quantized Whether to load the 8-bit quantized version of the model. Defaults to `false`.
   * @param options.progress_callback If specified, this function will be called during model construction, to provide the user with progress updates.
   */
  constructor({
    model = "all-MiniLM-L6-v2",
    revision = "main",
    quantized = false,
    progress_callback = null,
  }: {
    model?: string;
    revision?: string;
    quantized?: boolean;
    progress_callback?: Function | null;
  } = {}) {
    this.model = model;
    this.revision = revision;
    this.quantized = quantized;
    this.progress_callback = progress_callback;
  }

  public async generate(texts: string[]): Promise<number[][]> {
    this.pipelinePromise = new Promise(async (resolve, reject) => {
      try {
        const { pipeline, env } = await import('@xenova/transformers');
        const quantized = this.quantized
        const revision = this.revision
        const progress_callback = this.progress_callback
        const __filename = fileURLToPath(import.meta.url); 

        env.localModelPath = path.resolve(__filename, '../../../pretrained-model/')
        env.allowRemoteModels = false;
        resolve(pipeline("feature-extraction", this.model, {
          local_files_only: true,
          model_file_name: this.model,
          quantized,
          revision,
          progress_callback,
        }))       
      } catch (e) {
        reject(e);
      }
    });

    let pipe = await this.pipelinePromise;
    let output = await pipe(texts, { pooling: "mean", normalize: true });
    return output.tolist();
  }
}
