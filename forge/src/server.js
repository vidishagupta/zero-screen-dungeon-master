import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { forgeAdventure } from './generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// List all generated stories
app.get('/api/stories', (req, res) => {
  try {
    const storiesDir = path.resolve(__dirname, '../../stories');
    if (!fs.existsSync(storiesDir)) {
      return res.json([]);
    }
    const files = fs.readdirSync(storiesDir).filter(f => f.endsWith('.json'));
    const list = files.map(file => {
      const content = fs.readFileSync(path.join(storiesDir, file), 'utf-8');
      return JSON.parse(content);
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate new story via local Gemma
app.post('/api/forge', async (req, res) => {
  const { theme, vibe, walkLengthMeters, title, model } = req.body || {};
  try {
    const story = await forgeAdventure({
      theme: theme || 'fantasy',
      vibe: vibe || 'park',
      walkLengthMeters: Number(walkLengthMeters) || 560,
      title: title || '',
      model: model || 'gemma2:2b'
    });

    // Save to stories folder
    const storiesDir = path.resolve(__dirname, '../../stories');
    if (!fs.existsSync(storiesDir)) {
      fs.mkdirSync(storiesDir, { recursive: true });
    }
    const outPath = path.join(storiesDir, `${story.id}.json`);
    fs.writeFileSync(outPath, JSON.stringify(story, null, 2), 'utf-8');

    res.json({ success: true, story });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), model: process.env.GEMMA_MODEL || 'gemma2:2b' });
});

app.listen(PORT, () => {
  console.log(`Zero-Screen Dungeon Master Forge API running at http://localhost:${PORT}`);
});
