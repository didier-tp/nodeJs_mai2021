const odbc = require('odbc');
var NotFoundError = require('./errorWithStatus').NotFoundError;

const myConnectionString= 'DSN=mySqlServer';
//Server=localhost\SQLEXPRESS;Database=master;Trusted_Connection=True;

var odbcConnectionPool = null; 


function extractDataFromNodeOdbcResult(nodeOdbcResult){
  var data = nodeOdbcResult ;
  delete data.statement;
  delete data.return;
  delete data.columns;
  delete data.parameters;
  delete data.count;
  return data; //as array
}



function withConnectionPool(callbackWithPool) {
  if(odbcConnectionPool!=null){
    callbackWithPool(odbcConnectionPool);
  }
  else{
    //Ajuster si besoin la taille maxi du pool de connecion
    const connectionConfig = {
      connectionString: myConnectionString,
      connectionTimeout: 10,
      loginTimeout: 10,
      maxSize : 1
    }
    odbc.pool(connectionConfig, (error, pool) => {
      if(error)
          console.log("pool error:" + JSON.stringify(error));
      else{
        //console.log("pool:" + JSON.stringify(pool));
        odbcConnectionPool = pool;
        if(callbackWithPool)  
          callbackWithPool(pool);
      }
    });
  }
}

function withDbConnection(callbackWithDb) {
  withConnectionPool((odbcConnectionPool) => {
    odbcConnectionPool.connect( (error, connection) => {
      // connection is now an open Connection
      if(error)
        console.log("connection error:" + JSON.stringify(error));
      else{
        //console.log("connection:" + JSON.stringify(connection));
        callbackWithDb(connection , () => {
          connection.close();
        });
      }
    });
  }); //end of withConnectionPool
}

function executeStatement(sqlStatement , parameters , callback_with_err_and_count){
  withDbConnection((cn , done)=>{
    cn.createStatement((errorSt, statement) => {
      statement.prepare(sqlStatement,(errorPrepare) => {
        if (errorPrepare) { console.log(errorPrepare); } 
        statement.bind( parameters , (errorBind) =>{
          if (errorBind) { console.log(errorBind); } 
            statement.execute((errorExecute, result) => {
            statement.close();
            done();//can now close connection
            callback_with_err_and_count(errorExecute,errorExecute?0:result.count);
          })// end of statement.execute
        }) // end of statement.bind
      }); //end of statement.prepare
    }); //end of cn.createStatement(
  });//end of withDbConnection 
}//end of executeStatement

function executeQuery(sqlQuery,parameters,callback_with_err_or_resultArray){
  withDbConnection((cn , done)=>{
    cn.query(sqlQuery, parameters, (error, result) => {
      var dataArray = [];
      if (error) { 
        console.error(error)
       }
      else { 
        dataArray = extractDataFromNodeOdbcResult(result);
      }
      done();//can now close connection
      callback_with_err_or_resultArray(error,dataArray)
    });
  })
}

function essai(){
  
//essai select elementaire:
executeQuery('SELECT * FROM devise',[], (error, resultArray) => {
    if (error) { console.error(error) }
    console.log(resultArray);
  });


 //essai select by primary key:
  pk = "EUR";
  executeQuery('SELECT * FROM devise WHERE code=?', [pk] ,
      (error, resultArray) => {
    if (error) { console.error(error) }
    var devise = resultArray[0];
    console.log(devise);
  });


//essai select by where clause:
  changeMini = 1.0; 
  executeQuery('SELECT * FROM devise WHERE change >= ?', [changeMini] ,
      (error, resultArray) => {
    if (error) { console.error(error) }
    console.log(resultArray);
  });


 //essai insert into:

 executeStatement('INSERT INTO devise (code, nom, change) VALUES(?,?,?)',
 [ 'M4' , "monnaie4" , 1.5] , (err,count)=> {
   if(err) console.log("erreur="+JSON.stringify(err));
   console.log("count="+count);
 }
 );

}

essai();

/*
function init_devise_db() {
  withDbConnection(function (db) {
    db.serialize(function () {

      // Devise_ID INTEGER PRIMARY KEY  not used here (no autoincr)

      db.run("CREATE TABLE if not exists devise (code VARCHAR(12) PRIMARY KEY, nom VARCHAR(64) NOT NULL , change DOUBLE)");

      db.run("DELETE FROM devise");

      var pst = db.prepare("INSERT INTO DEVISE(code,nom,change) VALUES (?,?,?)");
      pst.run(["EUR", "Euro", 1.0]);
      pst.run(["USD", "Dollar", 1.1]);
      pst.run(["GBP", "Livre", 0.9]);
      pst.run(["JPY", "Yen", 123.0]);
      pst.finalize();

      db.each("SELECT code,nom,change FROM devise", function (err, row) {
        console.log(JSON.stringify(row));
      });
    });
  }
  ); //end of withDbConnection()
}



function insert_new_devise(devise, cb_with_err_and_lastId) {
  withDbConnection(function (cn) {
    var pst = db.prepare("INSERT INTO devise (code, nom, change) VALUES(?,?,?)");
    pst.run([devise.code, devise.nom, devise.change], function (err) {
      cb_with_err_and_lastId(err, this.lastID)
    });
    pst.finalize();
  }); //end of withDbConnection()
}

function insertNewDevise(devise) {
  return new Promise((resolve, reject) => {
  withDbConnection(function (db) {
    var pst = db.prepare("INSERT INTO devise (code, nom, change) VALUES(?,?,?)");
    pst.run([devise.code, devise.nom, devise.change], function (err) {
      if (err)
          reject(err);
        else
          resolve(devise);//no auto_incr , no this.lastID on devise.code
    });
    pst.finalize();
  }); //end of withDbConnection()
});//end of Promise
}

function update_devise(devise, cb_with_err_and_nbChanges) {
  withDbConnection(function (db) {
    var pst = db.prepare("UPDATE devise SET nom=? , change=? WHERE code=?");
    pst.run([devise.nom, devise.change, devise.code], function (err) {
      cb_with_err_and_nbChanges(err, this.changes)
    });
    pst.finalize();
  }); //end of withDbConnection()
}


function get_devises_by_WhereClause(whereClause) {
  return new Promise((resolve, reject) => {
    withDbConnection(function (db) {
      let sql = "SELECT code,nom,change FROM devise " + whereClause;
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



function get_devise_by_code(code) {
  return new Promise((resolve, reject) => {
    withDbConnection(function (db) {
      let sql = "SELECT code,nom,change FROM devise WHERE code=?";
      db.get(sql, code, function (err, row) {
        //console.log(JSON.stringify(row));
        if (err)
          reject(err);
        else if (row == null)
          reject("not found");
        else
          resolve(row);
      });
    }); //end of withDbConnection()
  });
}

function delete_devise_by_code(code, cb_with_err_and_nbChanges) {
  withDbConnection(function (db) {
    let sql = "DELETE FROM devise WHERE code=?";
    db.run(sql, code, function (err) {
      cb_with_err_and_nbChanges(err, this.changes)
    });
  }); //end of withDbConnection()
}

function deleteDeviseByCode(code) {
  return new Promise((resolve, reject) => {
  withDbConnection(function (db) {
    let sql = "DELETE FROM devise WHERE code=?";
    db.run(sql, code, function (err) {
      if (err)
          reject(err);
        else if (this.changes == 0)
          reject(new NotFoundError("not devise found for delete with code=" + code));
        else
          resolve();
    });
  }); //end of withDbConnection()
});
}


module.exports.init_devise_db = init_devise_db;
module.exports.get_devises_by_WhereClause = get_devises_by_WhereClause;
module.exports.get_devise_by_code = get_devise_by_code;
module.exports.delete_devise_by_code = delete_devise_by_code;
module.exports.insert_new_devise = insert_new_devise;
module.exports.insertNewDevise = insertNewDevise;
module.exports.update_devise = update_devise;
module.exports.deleteDeviseByCode=deleteDeviseByCode;

*/