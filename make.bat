@echo off
if "%1"=="repomix" (
    npx -y repomix
) else (
    echo Usage: make repomix
)
