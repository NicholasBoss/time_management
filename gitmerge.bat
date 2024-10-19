@echo off
REM Create git merge request from main to branch 
REM using branch name as argument

REM Usage: gitmerge.bat branch_name
REM Example: gitmerge.bat nickb

REM Check if branch name is provided
if "%1"=="" (
    echo Please provide branch name
    exit /b 1
)

REM Check if branch exists
git show-ref --verify --quiet refs/heads/%1
if errorlevel 1 (
    echo Branch %1 does not exist
    echo Please provide valid branch name or use gitbranch.bat to create new branch
    exit /b 1
)

git checkout main
git pull
git checkout %1
git merge main