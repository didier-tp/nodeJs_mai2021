Après installation par défaut de SQLExpress,
---------------
Server=localhost\SQLEXPRESS;Database=master;Trusted_Connection=True;
================
C:\Program Files\Microsoft SQL Server\Client SDK\ODBC\170\Tools\Binn
comportant sqlcmd (qui se connecte au serveur via odbc).
=================
dsn=mySqlServer créé (en mode 'utilisateur')
------------
via driver "ODBC Driver 17 for SQL Server" ,
server=localhost\SQLEXPRESS
avec authentification windows intégrée
et changer la base par défaut=master

==================

npm install odbc

===========
Fichiers liés à la version ODBC:
* init_db.sql
* init_base_sqlserver_express.bat
* devise-dao-odbc.js (FICHIER LE PLUS IMPORTANT)
* essai_node_odbc.js
* essai_node_odbc.bat
et modification suivante effectuée dans devise-api-routes_v3_avec_sqlite.js:
//var devise_dao_sqlite = require('./devise-dao-sqlite');
var devise_dao_sqlite = require('./devise-dao-odbc');

======
ça fonctionne bien en mode CRUD sur la table Devise dont la clef primaire
n'est pas auto-incrémentée.
----
Reste à voir s'il est possible de récupérer via odbc
la valeur d'une clef primaire
auto-incrémentée par le serveur


