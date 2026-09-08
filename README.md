# 🚀 GitHub Daily Contribution Bot & Visual Dashboard

An automated GitHub repository system that keeps your GitHub profile green contribution graph active on a daily basis. Comes with a **GitHub Actions automated runner**, **local CLI helper scripts**, **backdate commit generator**, and a **sleek dark-mode Web Dashboard**.

---

## 🌟 Key Features

- 🤖 **100% Automated Daily Commits**: Powered by GitHub Actions cron scheduler (runs daily at 09:00 UTC).
- 🔥 **Streak & Activity Tracking**: Records consecutive daily contribution streaks, timestamps, and developer quotes.
- 🎨 **Visual Web Dashboard**: Glassmorphic UI featuring a live contribution heat-map matrix, stats cards, and quote generator.
- ⏪ **Backdate Commit Tool**: Fill past missed grid days easily using the backdate CLI command.
- 🛡️ **Zero Server Maintenance**: Runs entirely inside GitHub's free infrastructure via GitHub Actions.

---

## ⚡ Quick Setup & GitHub Upload Guide

Follow these steps to upload this project to your GitHub account and start automated daily contributions:

### Step 1: Create a GitHub Repository
1. Go to [GitHub - New Repository](https://github.com/new).
2. Name your repo `auto-repo` (or any name you prefer, e.g., `daily-contributions`).
3. Set visibility to **Public** (GitHub profile contribution grid displays public repo activity by default).
4. Do **NOT** initialize with README or .gitignore (leave empty), then click **Create repository**.

### Step 2: Push Local Code to GitHub
Open your terminal inside this folder (`f:\Android\auto repo`) and execute:

```bash
# 1. Initialize git repository
git init

# 2. Add files and commit
git add .
git commit -m "🎉 Initial setup for GitHub Daily Contribution Bot"

# 3. Rename branch to main
git branch -M main

# 4. Link your remote GitHub repository (replace YOUR_USERNAME with your GitHub handle)
git remote add origin https://github.com/YOUR_USERNAME/auto-repo.git

# 5. Push to GitHub
git push -u origin main
```

---

### Step 3: Enable Workflow Permissions on GitHub (Crucial Step!)

To allow GitHub Actions to commit and push daily updates automatically:

1. Open your repository on GitHub.
2. Go to **Settings** ⚙️ tab (at the top of the repository page).
3. On the left sidebar, click **Actions** ➔ **General**.
4. Scroll down to **Workflow permissions**.
5. Select **Read and write permissions**.
6. Check **Allow GitHub Actions to create and approve pull requests**.
7. Click **Save**.

---

## 🛠️ How to Trigger Commits & Run Locally

### 1. Trigger via GitHub Actions Web UI (Manual)
1. Go to your repository on GitHub.
2. Click on the **Actions** tab.
3. Select **Daily GitHub Contribution Bot** from the left workflows menu.
4. Click **Run workflow** ➔ **Run workflow**.

### 2. Run Local Daily Commit
To run a commit manually from your computer:
```bash
npm run commit
```

### 3. Backdate Missed Days
To generate commits for the past 7 days:
```bash
npm run backdate --days=7
```

### 4. Launch Local Dashboard
To view the interactive visual dashboard:
```bash
npm start
```
Then open `http://localhost:8080` in your browser.

---

## 📊 File Structure

```
.
├── .github/
│   └── workflows/
│       └── daily-contribution.yml   # Scheduled GitHub Action workflow
├── src/
│   ├── generator.js                 # Dev quotes & topic generator
│   ├── auto-commit.js               # Core commit logic
│   └── backdate.js                  # Backdate CLI tool
├── data/
│   └── contributions.json           # Active JSON dataset
├── index.html                       # Visual Web Dashboard UI
├── styles.css                       # Dark Mode styling
├── app.js                          # Dashboard client logic
├── CONTRIBUTIONS.md                 # Live Markdown contribution table
├── package.json                     # Project manifest & scripts
└── README.md                        # Setup guide
```

---

## 💡 Tips for Maximum GitHub Green Grid Activity

1. Make sure your local Git email matches your GitHub account primary email:
   ```bash
   git config user.email "your-email@example.com"
   ```
2. Contributions in default branches (`main` or `master`) turn green on your profile graph.
3. If you want private contributions to show on your profile grid, ensure *"Private contributions"* is turned on in your GitHub profile settings.
