var sqlite3 = require('sqlite3').verbose();
var NotFoundError = require('./errorWithStatus').NotFoundError;

function withDbConnection(callbackWithDb) {
  var db = new sqlite3.Database('mydb.db');
  callbackWithDb(db);
  db.close();
}

function init_login_db() {
  withDbConnection(function (db) {
    db.serialize(function () {

      // Devise_ID INTEGER PRIMARY KEY  not used here (no autoincr)

      db.run("CREATE TABLE if not exists login (username VARCHAR(64) PRIMARY KEY, password VARCHAR(64) NOT NULL , roles VARCHAR(64))");

      db.run("DELETE FROM login");

      var pst = db.prepare("INSERT INTO login(username,password,roles) VALUES (?,?,?)");
      pst.run(["user1", "pwduser1", "user"]);
      pst.run(["user2", "pwduser2", "user"]);
      pst.run(["publisher1", "pwdpublisher1", "publisher"]);
      pst.run(["publisher2", "pwdpublisher2", "publisher"]);
      pst.run(["admin1", "pwdadmin1", "user,admin"]);
      pst.run(["admin2", "pwdadmin2", "admin"]);
      pst.finalize();

      db.each("SELECT username,password,roles FROM login", function (err, row) {
        console.log(JSON.stringify(row));
      });
    });
  }
  ); //end of withDbConnection()
}



function insert_new_login(login) {
  return new Promise((resolve, reject) => {
    withDbConnection(function (db) {
      var pst = db.prepare("INSERT INTO login (username, password, roles) VALUES(?,?,?)");
      pst.run([login.username, login.password, login.roles], function (err) {
        if (err)
          reject(err);
        else
          resolve(login);//no auto_incr , no this.lastID on login.username
      });
      pst.finalize();
    }); //end of withDbConnection()
  });//end of Promise
}

function update_login(devise) {
  return new Promise((resolve, reject) => {
    withDbConnection(function (db) {
      var pst = db.prepare("UPDATE login SET password=? , roles=? WHERE username=?");
      pst.run([login.password, devise.roles, devise.username], function (err) {
        if (err)
          reject(err);
        else if (this.changes == 0)
          reject(new NotFoundError("not login found for update with username=" + username));
        else
          resolve(devise);
      });
      pst.finalize();
    }); //end of withDbConnection()
  });//end of Promise
}


function get_logins_by_WhereClause(whereClause) {
  return new Promise((resolve, reject) => {
    withDbConnection(function (db) {
      let sql = "SELECT username,password,roles FROM login " + whereClause;
      db.all(sql, [], function (err, rows) {
        //console.log(JSON.stringify(rows));
        if (err)
          reject(err);
        else
          resolve(rows);
      });
    }); //end of withDbConnection()
  });//end of Promise
}


function get_login_by_username(username) {
  return new Promise((resolve, reject) => {
    withDbConnection(function (db) {
      let sql = "SELECT username,password,roles FROM login WHERE username=?";
      db.get(sql, username, function (err, row) {
        //console.log(JSON.stringify(row));
        if (err)
          reject(err);
        else if (row == null)
          reject(new NotFoundError("not login found with username=" + username));
        else
          resolve(row);
      });
    }); //end of withDbConnection()
  });
}

function delete_login_by_username(username) {
  return new Promise((resolve, reject) => {
    withDbConnection(function (db) {
      let sql = "DELETE FROM login WHERE username=?";
      db.run(sql, username, function (err) {
        if (err)
          reject(err);
        else if (this.changes == 0)
          reject(new NotFoundError("not login found for delete with username=" + username));
        else
          resolve();
      });
    }); //end of withDbConnection()
  });//end of Promise
}


module.exports.init_login_db = init_login_db;
module.exports.get_logins_by_WhereClause = get_logins_by_WhereClause;
module.exports.get_login_by_username = get_login_by_username;
module.exports.delete_login_by_username = delete_login_by_username;
module.exports.insert_new_login = insert_new_login;
module.exports.update_login = update_login;

/*

structure de Login  {
   username :string ; //id/pk (may be userId or unique email)
   password :string ; //may be stored as crypted password
   roles :string ; //ex: null or "admin,user" or "user" or ...
}

*/