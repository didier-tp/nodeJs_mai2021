REM set PYTHON_HOME=C:\Python27
REM set PATH=%PYTHON_HOME%;%PATH%
REM node-gyp requires python 2.7 , not python 3 !
REM npm install -g node-gyp
REM set IBM_DB_HOME=C:\Program Files\IBM\SQLLIB
set IBM_DB_HOME=D:\temp\clidriver
REM npm config set strict-ssl false
REM set NODE_TLS_REJECT_UNAUTHORIZED=0
npm install -s ibm_db
pause