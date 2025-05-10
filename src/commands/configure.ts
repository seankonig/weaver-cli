import prompts from 'prompts';
import chalk from 'chalk';
import { setConfig } from '../lib/config';

export async function configureWeave() {
  const response = await prompts({
    type: 'text',
    name: 'apiKey',
    message: 'Enter your OpenAI API Key',
    validate: (val) => val.startsWith('sk-') ? true : 'Must be a valid OpenAI key'
  });

  if (!response.apiKey) {
    console.log(chalk.yellow('⚠️ API key not set.'));
    return;
  }

  setConfig({ openaiApiKey: response.apiKey });
  console.log(chalk.green('✅ API key saved to ~/.weave/config.json'));
}