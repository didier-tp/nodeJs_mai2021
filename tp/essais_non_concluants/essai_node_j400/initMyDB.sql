 
CREATE DATABASE MYDB 
CONNECT TO MYDB
CREATE TABLE Devise ( code  VARCHAR(12) NOT NULL, name  VARCHAR(255) NOT NULL, change DOUBLE ,  PRIMARY KEY (code) )

INSERT INTO Devise(code,name,change) VALUES('EUR','Euro',1.0)
INSERT INTO Devise(code,name,change) VALUES('USD','Dollar',1.1)
INSERT INTO Devise(code,name,change) VALUES('GBP','livre',0.9)