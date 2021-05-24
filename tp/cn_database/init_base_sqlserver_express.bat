cd /d "%~dp0"
set SQLCMD_HOME=C:\Program Files\Microsoft SQL Server\Client SDK\ODBC\170\Tools\Binn
"%SQLCMD_HOME%\SQLCMD.exe" -S localhost\SQLEXPRESS -d master -i init_db.sql
pause