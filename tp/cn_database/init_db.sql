DROP TABLE devise;

CREATE TABLE devise(
   code VARCHAR(12) PRIMARY KEY,
   nom VARCHAR(64) NOT NULL ,
   change REAL
);

DELETE FROM devise;

INSERT INTO DEVISE(code,nom,change) VALUES ("EUR", "Euro", 1.0);
INSERT INTO DEVISE(code,nom,change) VALUES ("USD", "Dollar", 1.1);
INSERT INTO DEVISE(code,nom,change) VALUES ("GBP", "Livre", 0.9);
INSERT INTO DEVISE(code,nom,change) VALUES ("JPY", "Yen", 123.0);

SELECT * FROM devise;
