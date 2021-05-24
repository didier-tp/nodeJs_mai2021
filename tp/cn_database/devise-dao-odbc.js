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

function executeStatementPromise(sqlStatement , parameters){
  return new Promise((resolve, reject) => {
    executeStatement(sqlStatement , parameters,
      (err,count)=> {
        if(err) reject(err);
        else resolve(count);
      });
  });
}

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

function executeQueryPromise(sqlQuery,parameters){
  return new Promise((resolve, reject) => {
    executeQuery(sqlQuery,parameters,
      (error, resultArray) => {
        if (error) { reject(error) }
        else resolve(resultArray);
      });
  });
}

//************* fin de la partie generique ********/

async function essai(){
  try{
      //essai select by where clause:
      changeMini = 1.05; 
      var resultArray =  await executeQueryPromise('SELECT * FROM devise WHERE change >= ?', [changeMini] );
      console.log("init (change>1.05):" + JSON.stringify(resultArray));
    
    //essai insert into:

    var nbInsert  = await executeStatementPromise('INSERT INTO devise (code, nom, change) VALUES(?,?,?)',
    [ 'M1' , "monnaie1" , 1.5] );
    console.log("nbInsert="+nbInsert);


    // select by primary key (pour vérifier insert)
    var pk = "M1";
    var resArray = await executeQueryPromise('SELECT * FROM devise WHERE code=?', [pk] );
    var insertedDevise = resArray[0];
      console.log("insertedDevise="+ JSON.stringify(insertedDevise));

    //essai update :

    var nbUpdate  = await executeStatementPromise('UPDATE devise set nom=? , change=? WHERE code=?',
    [  "monnaie1-bis" , 1.7 , 'M1'] );
    console.log("nbUpdate="+nbUpdate);

    // select by primary key (pour vérifier update)
    pk = "M1";
    resArray = await executeQueryPromise('SELECT * FROM devise WHERE code=?', [pk]);
    var updatedDevise = resArray[0];
    console.log("updatedDevise="+ JSON.stringify(updatedDevise));

    //essai delete :

    var nbDelete = await executeStatementPromise('DELETE FROM devise WHERE code=?', [ 'M1'] );
    console.log("nbDelete="+nbDelete);

    //select elementaire (pour vérifier delete):
    resultArray = await executeQueryPromise('SELECT * FROM devise',[]);
    console.log("apres delete: " +JSON.stringify(resultArray));
  }
  catch(error){
    console.log(JSON.stringify(error))
  }
}






function insert_new_devise(devise, cb_with_err_and_lastId) {
  executeStatement('INSERT INTO devise (code, nom, change) VALUES(?,?,?)',
  [devise.code, devise.nom, devise.change] , (err,count) =>{
    cb_with_err_and_lastId(err, null);
  });
}

function insertNewDevise(devise) {
  return new Promise((resolve, reject) => {
  executeStatement('INSERT INTO devise (code, nom, change) VALUES(?,?,?)',
    [devise.code, devise.nom, devise.change] , (err,count) =>{
      if (err)
          reject(err);
        else
          resolve(devise);//no auto_incr 
    });
  });//end of Promise
}

function update_devise(devise, cb_with_err_and_nbChanges) {
  executeStatement("UPDATE devise SET nom=? , change=? WHERE code=?" ,
    [devise.nom, devise.change, devise.code], 
      cb_with_err_and_nbChanges );
}


function get_devises_by_WhereClause(whereClause) {
  return new Promise((resolve, reject) => {
    executeQuery("SELECT code,nom,change FROM devise " + whereClause ,
       [], function (err, rows) {
        //console.log(JSON.stringify(rows));
        if (err)
          reject(err);
        else
          resolve(rows);
      });
  });//end of Promise
}



function get_devise_by_code(code) {
  return new Promise((resolve, reject) => {
    executeQuery("SELECT code,nom,change FROM devise WHERE code=?",
      [ code ], function (err, rows) {
        //console.log(JSON.stringify(rows));
        if (err)
          reject(err);
        else if (rows == null)
          reject("not found");
        else
          resolve(rows[0]);
      });
  });
}

function delete_devise_by_code(code, cb_with_err_and_nbChanges) {
  executeStatement("DELETE FROM devise WHERE code=?",
    [ code ],   cb_with_err_and_nbChanges);
}

function deleteDeviseByCode(code) {
  return new Promise((resolve, reject) => {
    executeStatement("DELETE FROM devise WHERE code=?",
    [ code ],  function (err,count) {
      if (err)
          reject(err);
        else if (count == 0)
          reject(new NotFoundError("not devise found for delete with code=" + code));
        else
          resolve();
    })
});
}


module.exports.essai = essai;
module.exports.get_devises_by_WhereClause = get_devises_by_WhereClause;
module.exports.get_devise_by_code = get_devise_by_code;
module.exports.delete_devise_by_code = delete_devise_by_code;
module.exports.insert_new_devise = insert_new_devise;
module.exports.insertNewDevise = insertNewDevise;
module.exports.update_devise = update_devise;
module.exports.deleteDeviseByCode=deleteDeviseByCode;
