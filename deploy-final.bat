@echo off
echo ========================================
echo   Final Deploy - Gemini 2.5 + Cache Clear
echo ========================================
echo.
echo Changes:
echo ✅ Gemini 2.5 Flash model
echo ✅ Detailed debug logging
echo ✅ Clear Cache button in UI
echo.

git add frontend/src/components/Layout.tsx
git add netlify/functions/analyze.ts
git add netlify/functions/summarize.ts
git add netlify/functions/suggestions.ts
git add GEMINI_2.5_UPGRADE.md

git commit -m "feat: Add Clear Cache button and upgrade to Gemini 2.5 Flash"
git push

echo.
echo ========================================
echo   ✅ Deploy Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Wait 2 minutes for Netlify build
echo 2. Open app in Incognito mode (Ctrl+Shift+N)
echo 3. Or use new "Clear Cache" button in sidebar
echo 4. Test text analysis
echo.
echo If still not working:
echo - Check Netlify Function logs
echo - Send logs to developer
echo.
pause


