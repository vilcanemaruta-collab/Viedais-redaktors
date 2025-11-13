@echo off
echo Deploying with stable Gemini model (gemini-1.5-flash)...
git add netlify/functions/analyze.ts netlify/functions/summarize.ts netlify/functions/suggestions.ts
git commit -m "fix: Use stable Gemini model (gemini-1.5-flash) instead of experimental"
git push

echo.
echo ✅ Done! Netlify will deploy in ~2 minutes.
echo.
echo Changes:
echo - gemini-2.0-flash-exp → gemini-1.5-flash (stable)
echo - Added detailed error logging
echo.
echo After deployment, test the app and check Function logs if issues persist.
pause

