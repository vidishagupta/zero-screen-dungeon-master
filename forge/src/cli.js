import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import { forgeAdventure } from './generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question, defaultVal = '') {
  return new Promise((resolve) => {
    rl.question(`${question} ${defaultVal ? `[${defaultVal}] ` : ''}: `, (answer) => {
      resolve(answer.trim() || defaultVal);
    });
  });
}

async function main() {
  console.log('========================================================');
  console.log('   ZERO-SCREEN DUNGEON MASTER - STORY FORGE (CLI)      ');
  console.log('   Powered by Local Open-Weight Gemma via Ollama       ');
  console.log('========================================================\n');

  try {
    const theme = await ask('Adventure Theme (fantasy, sci-fi, mystery, mythology)', 'fantasy');
    const vibe = await ask('Outdoor Vibe (e.g. city park, foggy woods, quiet campus)', 'city park');
    const walkStr = await ask('Target Walk Distance in meters', '560');
    const title = await ask('Optional Title hint (leave blank for AI choice)', '');
    const model = await ask('Ollama Gemma Model name', 'gemma2:2b');

    console.log('\nForging adventure... Make sure Ollama is running (`ollama serve` / `ollama run gemma2:2b`)\n');

    const story = await forgeAdventure({
      theme,
      vibe,
      walkLengthMeters: parseInt(walkStr, 10) || 560,
      title,
      model
    });

    const outDir = path.resolve(__dirname, '../../stories');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const filename = `${story.id}.json`;
    const outPath = path.join(outDir, filename);
    fs.writeFileSync(outPath, JSON.stringify(story, null, 2), 'utf-8');

    console.log(`\nSUCCESS! Story saved to: ${outPath}`);
    console.log(`Title: ${story.title}`);
    console.log(`Checkpoints: ${story.checkpoints.length}`);
    console.log(`Endings: ${story.endings.length}`);
  } catch (err) {
    console.error('\nForge Error:', err.message);
    console.log('Tip: Ensure Ollama is running with `ollama run gemma2:2b`');
  } finally {
    rl.close();
  }
}

main();
