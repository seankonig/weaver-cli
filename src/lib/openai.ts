import { Configuration, OpenAIApi } from 'openai';
import { getOpenAIKey } from './config';

const apiKey = getOpenAIKey();
if (!apiKey) {
  throw new Error('❌ OpenAI API key not found. Run `weave config` first.');
}

const configuration = new Configuration({ apiKey });
export const openai = new OpenAIApi(configuration);