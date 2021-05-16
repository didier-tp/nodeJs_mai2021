var ibmdb = require('ibm_db');
var connStr = "DATABASE=myDB;HOSTNAME=localhost;UID=db2admin;PWD=db2admin;PORT=50000;PROTOCOL=TCPIP";

ibmdb.open(connStr, function (err,conn) {
  if (err) return console.log(err);
  
  conn.query('select * from Devise', function (err, data) {
    if (err) console.log(err);
    else console.log(data);

    conn.close(function () {
      console.log('done');
    });
  });
});
/*
ibmdb.open(connStr).then(
    conn => {
      conn.query("select 1 from sysibm.sysdummy1").then(data => {
        console.log(data);
        conn.closeSync();
      }, err => {
        console.log(err);
      });
    }, err => {
      console.log(err)
    }
);*/