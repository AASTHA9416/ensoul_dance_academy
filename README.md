# Ensoul Dance & Fitness Studio - Static Website

A high-end dark-neon static website for lead generation and demo booking.

## UX Highlights Implemented

- Sticky glassmorphism navbar
- Hero split layout with auto-playing muted video and unmute toggle
- Animated "Book 2-Day Free Demo" CTA
- Style Explorer cards with hover lift and neon accents
- Premium lead generation form with level and dance preference capture
- Static lead form flow with pre-filled email draft (no backend or database required)

## Suggested AI/Automation Models for Growth

1. Lead Scoring Model
- Input: source, style choice, preferred time, response speed
- Output: high/medium/low conversion likelihood
- Use: prioritize callbacks

2. Retention Risk Model
- Input: attendance consistency, preferred style, session gaps
- Output: churn risk score
- Use: trigger re-engagement campaigns

3. WhatsApp/Chat Assistant (LLM)
- Model suggestion: GPT-4.1-mini class model for fast FAQ and trial scheduling drafts
- Use: instant responses for class timing, pricing, and style recommendations

## Run Instructions

### Website

1. cd frontend
2. npm install
3. npm run dev

The demo form opens your default email app with the submitted details.

## Deploy To GitHub Pages

Run these commands from the frontend folder:

1. cd frontend
2. npm install
3. npm run deploy

This will build the app and push the dist output to the gh-pages branch.

After first deploy, enable GitHub Pages in your repository settings:

1. Open GitHub repository Settings -> Pages
2. Source: Deploy from branch
3. Branch: gh-pages
4. Folder: / (root)

Your live URL will be:

https://<your-github-username>.github.io/<your-repository-name>/
