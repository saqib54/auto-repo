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

// Parse CLI arguments: e.g. node src/backdate.js --days=10
let daysToBackdate = 7;
const daysArg = process.argv.find(arg => arg.startsWith('--days='));
if (daysArg) {
  const parsed = parseInt(daysArg.split('=')[1], 10);
  if (!isNaN(parsed) && parsed > 0) {
    daysToBackdate = parsed;
  }
}

console.log(`⏳ Starting backdate process for past ${daysToBackdate} days...`);

let data = {
  totalCommits: 0,
  currentStreak: 0,
  lastCommitDate: null,
  history: []
};

if (fs.existsSync(DATA_FILE)) {
  try {
    data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {}
}

const today = new Date();

for (let i = daysToBackdate; i >= 1; i--) {
  const backdate = new Date(today);
  backdate.setDate(today.getDate() - i);
  const dateStr = backdate.toISOString().split('T')[0];
  const timeStr = "12:00:00";
  const timestampStr = `${dateStr} ${timeStr}`;
  
  const streak = daysToBackdate - i + 1;
  const entry = generateDailyEntry(streak);
  entry.date = dateStr;
  entry.timestamp = timestampStr;
  entry.message = `Backdated contribution for ${dateStr}`;
  
  data.totalCommits += 1;
  data.currentStreak = streak;
  data.lastCommitDate = dateStr;
  data.history.unshift(entry);
  
  // Append to MD file
  if (!fs.existsSync(MD_FILE)) {
    const header = `# 📈 GitHub Daily Contributions Log\n\nAutomated log of daily GitHub contributions, developer quotes, and skill tracking.\n\n| Date & Time | Streak Day | Focus Topic | Inspirational Quote |\n|---|---|---|---|\n`;
    fs.writeFileSync(MD_FILE, header, 'utf8');
  }
  const mdLine = `| ${entry.timestamp} | Day ${entry.streak} 🔥 | ${entry.topic} | "${entry.quote}" |\n`;
  fs.appendFileSync(MD_FILE, mdLine, 'utf8');

  // Try creating a backdated Git commit using GIT_AUTHOR_DATE and GIT_COMMITTER_DATE
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    const isoDate = `${dateStr}T12:00:00`;
    execSync(`git add data/contributions.json CONTRIBUTIONS.md`, { cwd: ROOT_DIR });
    execSync(`git commit --date="${isoDate}" -m "📈 Backdated contribution update [${dateStr}]"`, {
      cwd: ROOT_DIR,
      env: { ...process.env, GIT_AUTHOR_DATE: isoDate, GIT_COMMITTER_DATE: isoDate }
    });
    console.log(`  ✓ Created git commit for date ${dateStr}`);
  } catch (err) {
    console.log(`  ⚠️ Notice on ${dateStr}: ${err.message}`);
  }
}

fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
console.log(`\n🎉 Backdate completed! Total commits added: ${daysToBackdate}`);
console.log(`👉 Remember to push to GitHub with: git push origin main`);
