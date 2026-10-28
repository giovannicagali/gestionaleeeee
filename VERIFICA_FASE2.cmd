@echo off
setlocal
cd /d "%~dp0"
echo =================================================
echo    APP SCHEDE D^&D - VERIFICA CODICE FASE 2
 echo =================================================
echo Questa procedura NON modifica il database Supabase.
echo.
echo [1/3] Test automatici...
call npm run test
if errorlevel 1 goto :failure
echo.
echo [2/3] Controllo tipi TypeScript...
call npm run typecheck
if errorlevel 1 goto :failure
echo.
echo [3/3] Compilazione frontend...
call npm run build
if errorlevel 1 goto :failure
echo.
echo TUTTI I CONTROLLI LOCALI SONO PASSATI.
echo Restano necessari i test manuali con Supabase descritti in docs\PHASE2_REVIEW_2026-10-28.md.
pause
exit /b 0
:failure
echo.
echo UN CONTROLLO NON E' PASSATO: annotare l'errore visualizzato.
echo Non eseguire reset del database per risolvere questo problema.
pause
exit /b 1
