// Helper module for generating daily logs and technical tips
const DEV_QUOTES = [
  "Consistency is what transforms average into excellence.",
  "Code every day, even if it's just one meaningful refactor.",
  "First, solve the problem. Then, write the code. — John Johnson",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. — Martin Fowler",
  "Experience is the name everyone gives to their mistakes. — Oscar Wilde",
  "Make it work, make it right, make it fast. — Kent Beck",
  "Simplicity is prerequisite for reliability. — Edsger W. Dijkstra",
  "Small daily gains over time lead to stunning results.",
  "Continuous learning is the minimum requirement for success in software engineering.",
  "Focus on progress, not perfection."
];

const DEV_TOPICS = [
  "Clean Code & Refactoring",
  "Git & Workflow Optimization",
  "Performance Tuning & Benchmarking",
  "UI/UX Visual Refinement",
  "REST API & GraphQL Design",
  "State Management Best Practices",
  "Security Auditing & Hardening",
  "CI/CD Pipeline Automation",
  "Data Structures & Algorithms",
  "Modern JavaScript & TypeScript Patterns"
];

export function getRandomQuote() {
  const index = Math.floor(Math.random() * DEV_QUOTES.length);
  return DEV_QUOTES[index];
}

export function getRandomTopic() {
  const index = Math.floor(Math.random() * DEV_TOPICS.length);
  return DEV_TOPICS[index];
}

export function generateDailyEntry(streakCount = 1) {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0];
  const quote = getRandomQuote();
  const topic = getRandomTopic();
  
  return {
    id: `contrib-${Date.now()}`,
    date: dateStr,
    timestamp: `${dateStr} ${timeStr}`,
    streak: streakCount,
    topic: topic,
    quote: quote,
    message: `Daily streak day ${streakCount}: ${topic}`
  };
}
