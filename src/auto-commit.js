import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { generateDailyEntry } from './generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const DATA_FILE = path.join(ROOT_DIR, 'data', 'contributions.json');
const MD_FILE = path.join(ROOT_DIR, 'CONTRIBUTIONS.md');

// Ensure data directory exists
const dataDir = path.join(ROOT_DIR, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load existing contributions data
let data = {
  totalCommits: 0,
  currentStreak: 0,
  lastCommitDate: null,
  history: []
};

if (fs.existsSync(DATA_FILE)) {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    data = JSON.parse(raw);
  } catch (err) {
    console.warn("Could not parse existing contributions.json, starting fresh.");
  }
}

// Calculate streak
const today = new Date().toISOString().split('T')[0];
let newStreak = 1;

if (data.lastCommitDate) {
  const lastDate = new Date(data.lastCommitDate);
  const currDate = new Date(today);
  const diffDays = Math.round((currDate - lastDate) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    newStreak = (data.currentStreak || 0) + 1;
  } else if (diffDays === 0) {
    newStreak = data.currentStreak || 1;
  } else {
    newStreak = 1;
  }
}

// Create new entry
const entry = generateDailyEntry(newStreak);

data.totalCommits += 1;
data.currentStreak = newStreak;
data.lastCommitDate = today;
data.history.unshift(entry);

// Limit history to 500 entries for JSON performance
if (data.history.length > 500) {
  data.history = data.history.slice(0, 500);
}

// Write updated JSON
fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');

// Ensure CONTRIBUTIONS.md header exists
if (!fs.existsSync(MD_FILE)) {
  const header = `# 📈 GitHub Daily Contributions Log\n\nAutomated log of daily GitHub contributions, developer quotes, and skill tracking.\n\n| Date & Time | Streak Day | Focus Topic | Inspirational Quote |\n|---|---|---|---|\n`;
  fs.readFileSync;
  fs.writeFileSync(MD_FILE, header, 'utf8');
}

// Append entry to CONTRIBUTIONS.md
const mdLine = `| ${entry.timestamp} | Day ${entry.streak} 🔥 | ${entry.topic} | "${entry.quote}" |\n`;
fs.appendFileSync(MD_FILE, mdLine, 'utf8');

console.log(`✅ Contribution logged successfully!`);
console.log(`- Date: ${entry.timestamp}`);
console.log(`- Streak: ${entry.streak} days 🔥`);
console.log(`- Total Commits: ${data.totalCommits}`);
console.log(`- Topic: ${entry.topic}`);
console.log(`- Quote: "${entry.quote}"`);

// Optional local git commit if requested via CLI arg --git
if (process.argv.includes('--git')) {
  try {
    execSync('git add data/contributions.json CONTRIBUTIONS.md', { cwd: ROOT_DIR });
    execSync(`git commit -m "📈 Daily contribution update [${today}]"`, { cwd: ROOT_DIR });
    console.log(`🚀 Git commit created locally!`);
  } catch (err) {
    console.log(`ℹ️ Git auto-commit note: ${err.message}`);
  }
}
