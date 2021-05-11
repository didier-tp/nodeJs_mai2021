var ibmdb = require('ibm_db');
var connStr = "DATABASE=<dbname>;HOSTNAME=<myhost>;UID=db2user;PWD=password;PORT=<dbport>;PROTOCOL=TCPIP";

ibmdb.open(connStr, function (err,conn) {
  if (err) return console.log(err);
  
  conn.query('select * from sysibm.sysdummy1', function (err, data) {
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