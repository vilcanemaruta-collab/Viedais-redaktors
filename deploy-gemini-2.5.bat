@echo off
echo ========================================
echo   Deploying Gemini 2.5 Flash Update
echo ========================================
echo.
echo Changes:
echo - gemini-2.0-flash-exp → gemini-2.5-flash
echo - Latest and fastest Gemini model
echo - Detailed error logging enabled
echo.

git add netlify/functions/analyze.ts netlify/functions/summarize.ts netlify/functions/suggestions.ts
git commit -m "feat: Upgrade to Gemini 2.5 Flash (latest model)"
git push

echo.
echo ========================================
echo   ✅ Deploy Complete!
echo ========================================
echo.
echo Netlify will build in ~2 minutes.
echo.
echo Next steps:
echo 1. Wait for Netlify build to complete
echo 2. Test the application
echo 3. Check Function logs if issues persist
echo.
echo Function logs location:
echo Netlify Dashboard → Functions → analyze → Recent invocations
echo.
pause

