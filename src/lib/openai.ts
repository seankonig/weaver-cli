import { Configuration, OpenAIApi } from "openai";
import { ensureApiKey } from "./config";

export function getOpenAI(): OpenAIApi {
  const apiKey = ensureApiKey(); // Will exit with error if not set
  const config = new Configuration({ apiKey });
  return new OpenAIApi(config);
}
