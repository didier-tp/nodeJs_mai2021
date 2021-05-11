REM set JAVA_HOME=C:\Program Files\Java\jdk1.8.0_144
REM seule une version 32bits de java est supportée
set JAVA_HOME=D:\Prog\java\java-se-8u41-ri_32bits
set PYTHON_HOME=C:\Python27
set PATH=%JAVA_HOME%\bin;%PYTHON_HOME%;%PATH%
REM node-gyp requires python 2.7 , not python 3 !
REM npm install -g node-gyp
npm install -s node-jt400
pause