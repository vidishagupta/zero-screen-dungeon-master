import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { StorySchema, validateGraphConnectivity } from './schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storiesDir = path.resolve(__dirname, '../../stories');
const files = fs.readdirSync(storiesDir).filter(f => f.endsWith('.json'));

console.log(`Found ${files.length} story files to validate...\n`);

let failed = 0;

for (const file of files) {
  const filePath = path.join(storiesDir, file);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    const parsed = StorySchema.parse(data);
    const graphCheck = validateGraphConnectivity(parsed);

    if (!graphCheck.valid) {
      console.error(`❌ [FAIL] ${file} - Graph connectivity errors:`);
      graphCheck.errors.forEach(e => console.error(`   - ${e}`));
      failed++;
    } else {
      console.log(`✅ [PASS] ${file} -> "${parsed.title}" (${parsed.checkpoints.length} checkpoints, ${parsed.endings.length} endings)`);
    }
  } catch (err) {
    console.error(`❌ [FAIL] ${file} - Schema validation error:`, err.message);
    failed++;
  }
}

if (failed > 0) {
  console.error(`\nValidation finished with ${failed} failure(s).`);
  process.exit(1);
} else {
  console.log(`\nAll stories passed schema and graph validation! 🎉`);
}
