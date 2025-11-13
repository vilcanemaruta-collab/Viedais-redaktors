@echo off
echo Deploying Gemini debug version...
git add netlify/functions/analyze.ts
git commit -m "feat: Add detailed Gemini API error logging"
git push

echo.
echo Done! Check Netlify Functions logs in ~2 minutes to see Gemini errors.
echo.
echo To view logs:
echo 1. Go to Netlify Dashboard
echo 2. Click "Functions"
echo 3. Click "analyze"
echo 4. View "Recent invocations"
pause

