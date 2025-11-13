@echo off
echo Adding files...
git add frontend/src/pages/Analysis.tsx
git add frontend/src/services/api.ts
git add netlify/functions/analyze.ts

echo Committing...
git commit -m "feat: Add comprehensive debug logging to frontend and backend"

echo Pushing to GitHub...
git push

echo.
echo Done! Netlify will auto-deploy in ~2 minutes.
echo Check Netlify Functions logs after deployment.
pause

