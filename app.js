// Client dashboard script
import { getRandomQuote, getRandomTopic } from './src/generator.js';

let contributionsData = {
  totalCommits: 1,
  currentStreak: 1,
  lastCommitDate: new Date().toISOString().split('T')[0],
  history: [
    {
      id: "contrib-1",
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      streak: 1,
      topic: "Clean Code & Refactoring",
      quote: "Consistency is what transforms average into excellence.",
      message: "Daily streak day 1"
    }
  ]
};

async function loadData() {
  try {
    const res = await fetch('./data/contributions.json');
    if (res.ok) {
      contributionsData = await res.json();
    }
  } catch (e) {
    console.warn("Using local fallback data.");
  }
  renderDashboard();
}

function renderDashboard() {
  // Stat values
  document.getElementById('stat-streak').innerHTML = `${contributionsData.currentStreak} <span class="unit">Days</span>`;
  document.getElementById('stat-total').textContent = contributionsData.totalCommits;
  
  const lastDate = contributionsData.lastCommitDate || 'N/A';
  document.getElementById('stat-last-time').textContent = `Updated ${lastDate}`;
  
  if (contributionsData.history && contributionsData.history.length > 0) {
    const latest = contributionsData.history[0];
    document.getElementById('stat-top-topic').textContent = latest.topic.split(' ')[0] || 'Coding';
    document.getElementById('quote-text').textContent = `"${latest.quote}"`;
    document.getElementById('quote-topic-badge').textContent = latest.topic;
  }
  
  renderHeatmap();
  renderHistoryTable();
}

function renderHeatmap() {
  const container = document.getElementById('heatmap-grid');
  container.innerHTML = '';
  
  // Create 364 tiles (52 weeks x 7 days)
  const totalCells = 52 * 7;
  const commitDatesMap = new Map();
  
  if (contributionsData.history) {
    contributionsData.history.forEach(item => {
      commitDatesMap.set(item.date, (commitDatesMap.get(item.date) || 0) + 1);
    });
  }

  // Generate grid cells representing past year
  const today = new Date();
  for (let i = totalCells - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = commitDatesMap.get(dateStr) || 0;
    
    let levelClass = 'level-0';
    if (count >= 4) levelClass = 'level-4';
    else if (count === 3) levelClass = 'level-3';
    else if (count === 2) levelClass = 'level-2';
    else if (count === 1) levelClass = 'level-1';

    const cell = document.createElement('div');
    cell.className = `cell ${levelClass}`;
    cell.title = `${dateStr}: ${count} contribution(s)`;
    container.appendChild(cell);
  }
}

function renderHistoryTable() {
  const tbody = document.getElementById('logs-table-body');
  const countEl = document.getElementById('history-count');
  tbody.innerHTML = '';
  
  const history = contributionsData.history || [];
  countEl.textContent = history.length;
  
  history.slice(0, 15).forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.timestamp}</td>
      <td><span class="text-emerald">Day ${item.streak} 🔥</span></td>
      <td><span class="topic-pill">${item.topic}</span></td>
      <td>"${item.quote}"</td>
    `;
    tbody.appendChild(tr);
  });
}

function setupEventListeners() {
  // New Quote button
  document.getElementById('btn-new-quote').addEventListener('click', () => {
    const q = getRandomQuote();
    const t = getRandomTopic();
    document.getElementById('quote-text').textContent = `"${q}"`;
    document.getElementById('quote-topic-badge').textContent = t;
  });

  // Simulate Commit button
  document.getElementById('btn-manual-trigger').addEventListener('click', () => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];
    
    const newStreak = contributionsData.currentStreak + 1;
    const topic = getRandomTopic();
    const quote = getRandomQuote();
    
    const newEntry = {
      id: `contrib-${Date.now()}`,
      date: dateStr,
      timestamp: `${dateStr} ${timeStr}`,
      streak: newStreak,
      topic: topic,
      quote: quote,
      message: `Daily streak day ${newStreak}`
    };
    
    contributionsData.totalCommits += 1;
    contributionsData.currentStreak = newStreak;
    contributionsData.lastCommitDate = dateStr;
    contributionsData.history.unshift(newEntry);
    
    renderDashboard();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadData();
  setupEventListeners();
});
