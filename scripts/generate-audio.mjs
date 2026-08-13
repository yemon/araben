#!/usr/bin/env node
// Generates MP3 pronunciations for a curated set of Arabic words via Eleven Labs.
//
// Usage:
//   1. Copy .env.example to .env.local and set ELEVENLABS_API_KEY.
//   2. `npm run audio` — writes MP3s to public/audio and updates content/audio-manifest.json.
//   3. Re-run any time; already-generated words are skipped.
//
// Selection strategy:
//   Conversation-first — greetings + essential verbs + question words + common nouns +
//   particles + numbers + pronouns from Part 2, capped at AUDIO_BATCH_SIZE (default 100).
//   You can widen it by bumping the env var, or by adding more categories in
//   CONVERSATION_CATEGORIES.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Best-effort .env.local loader (no dep required).
loadDotEnv(path.join(ROOT, '.env.local'));
loadDotEnv(path.join(ROOT, '.env'));

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';
const BATCH = Number(process.env.AUDIO_BATCH_SIZE || 100);

if (!API_KEY) {
  console.error(
    'Missing ELEVENLABS_API_KEY. Copy .env.example to .env.local and add your key.'
  );
  process.exit(1);
}

const CONTENT = path.join(ROOT, 'content');
const AUDIO_DIR = path.join(ROOT, 'public', 'audio');
fs.mkdirSync(AUDIO_DIR, { recursive: true });

const words = JSON.parse(fs.readFileSync(path.join(CONTENT, 'words.json'), 'utf8'));
const basics = JSON.parse(fs.readFileSync(path.join(CONTENT, 'basics.json'), 'utf8'));

// Categories that map to spoken conversation, in priority order.
const CONVERSATION_CATEGORIES = [
  'greetings',
  'pronouns',
  'question-words',
  'verbs',
  'nouns',
  'particles',
  'numbers',
  'adjectives',
  'survival',
];

// Build the ordered word slug list from Part 2 categories, deduped.
const seen = new Set();
const queue = [];
for (const catSlug of CONVERSATION_CATEGORIES) {
  const cat = basics.categories.find((c) => c.slug === catSlug);
  if (!cat) continue;
  for (const slug of cat.wordSlugs) {
    if (seen.has(slug)) continue;
    seen.add(slug);
    queue.push(slug);
  }
}

// Load existing manifest to skip already-generated audio.
const manifestPath = path.join(CONTENT, 'audio-manifest.json');
const manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  : {};

const wordBySlug = new Map(words.map((w) => [w.slug, w]));

const target = queue.slice(0, BATCH);
console.log(
  `Planning ${target.length} pronunciations (voice=${VOICE_ID}, model=${MODEL_ID}).`
);
let done = 0;
let skipped = 0;
let failed = 0;

for (const slug of target) {
  const word = wordBySlug.get(slug);
  if (!word) {
    console.warn(`  ! ${slug} — not found in words.json`);
    failed++;
    continue;
  }
  const filename = `${slug}.mp3`;
  const outPath = path.join(AUDIO_DIR, filename);
  if (fs.existsSync(outPath) && manifest[slug]) {
    skipped++;
    continue;
  }
  try {
    const mp3 = await ttsRequest(word.arabic);
    fs.writeFileSync(outPath, Buffer.from(mp3));
    manifest[slug] = filename;
    done++;
    console.log(`  ✓ ${slug} — ${word.arabic}`);
    // Polite throttle so we don't spike the free tier
    await sleep(400);
  } catch (err) {
    failed++;
    console.error(`  ✗ ${slug} — ${err.message}`);
  }
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(
  `\nDone. Generated: ${done}, skipped (already had): ${skipped}, failed: ${failed}.`
);
console.log(`Manifest: content/audio-manifest.json`);

// ------------------------------------------------------------------

async function ttsRequest(text) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
      accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: MODEL_ID,
      voice_settings: { stability: 0.5, similarity_boost: 0.7, style: 0.0, use_speaker_boost: true },
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${res.statusText} ${body.slice(0, 200)}`);
  }
  const buf = await res.arrayBuffer();
  return buf;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadDotEnv(file) {
  if (!fs.existsSync(file)) return;
  const raw = fs.readFileSync(file, 'utf8');
  for (const line of raw.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const [, k, v] = m;
    const value = v.replace(/^['"]|['"]$/g, '');
    if (!process.env[k]) process.env[k] = value;
  }
}
