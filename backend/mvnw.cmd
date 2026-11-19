@echo off
setlocal
if not defined JAVA_HOME (
    if exist "C:\Program Files\Java\jdk-26.0.2" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-26.0.2"
    ) else if exist "C:\Program Files\Java\latest" (
        set "JAVA_HOME=C:\Program Files\Java\latest"
    )
)
set "MAVEN_CMD=%~dp0..\.tools\apache-maven-3.9.9\bin\mvn.cmd"
set "REPO_PATH=%~dp0..\.m2\repository"
if exist "%MAVEN_CMD%" (
    call "%MAVEN_CMD%" -Dmaven.repo.local="%REPO_PATH%" %*
) else (
    mvn -Dmaven.repo.local="%REPO_PATH%" %*
)
