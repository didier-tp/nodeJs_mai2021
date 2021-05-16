1. https://public.dhe.ibm.com/ibmdl/export/pub/software/data/db2/drivers/odbc_cli/
et télécharger ntx64_odbc_cli.zip
2. extraire le contenu de ce zip dans un répertoire (ex: d:\temp ).
   ==> D:\temp\clidriver
3. fixer variable d'enrironnement si besoin IBM_DB_INSTALLER_URL
==============
https://www.ibm.com/support/producthub/db2w/docs/content/SSCJDQ/com.ibm.swg.im.dashdb.doc/connecting/connect_connecting_cli_and_odbc_applications.html
 


db2cli writecfg add -dsn alias -database ???DB -host hostname -port 50001​
db2cli validate -dsn alias -connect -user userid -passwd password