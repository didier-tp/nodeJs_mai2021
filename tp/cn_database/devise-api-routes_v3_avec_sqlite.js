var express = require('express');
const apiRouter = express.Router();

var devise_dao_sqlite = require('./devise-dao-sqlite');
var pre_traitements =  require("./pre-traitements");

//exemple URL: http://localhost:8282/devise-api/public/devise/EUR
apiRouter.route('/devise-api/public/devise/:code')
.get( async function(req , res  , next ) {
	try { 
		var codeDevise = req.params.code;
		let devise = await devise_dao_sqlite.get_devise_by_code( codeDevise );
		res.send(devise);
	}catch(err){
		res.status(404).send({ err : 'not found'});
	}					
});

//exemple URL: http://localhost:8282/devise-api/public/conversion?montant=100&source=EUR&cible=USD
apiRouter.route('/devise-api/public/conversion')
//.get( pre_traitements.displayHeaders , async function(req , res  , next ) {
// si app.use(pre_traitements.displayHeaders) dans server.js
// prétraitement déjà enregistré pour toutes les routes
.get(  async function(req , res  , next ) {	
	try{
		var montant = Number(req.query.montant);
		var source = req.query.source;
		var cible = req.query.cible;
		let deviseSource = await devise_dao_sqlite.get_devise_by_code(source);
		let deviseCible = await devise_dao_sqlite.get_devise_by_code(cible); 
		/*
		const [ deviseSource , deviseCible ] = await Promise.all( [ 
			devise_dao_sqlite.get_devise_by_code(source) ,
            devise_dao_sqlite.get_devise_by_code(cible)
			] );*/
		let montantConverti = montant * deviseCible.change / deviseSource.change;
		res.send({ montant , source , cible , montantConverti});
	}catch(err){
		console.log(JSON.stringify(err));
		res.status(500).send({ erreur : 'echec conversion'})
	}
});


//exemple URL: http://localhost:8282/devise-api/public/devise (returning all devises)
//             http://localhost:8282/devise-api/public/devise?changeMini=1.05
apiRouter.route('/devise-api/public/devise')
.get( async function(req , res  , next ) {
	var changeMini = Number(req.query.changeMini);
	var whereClause=changeMini?"WHERE change >= "+changeMini : "";
	//console.log("whereClause="+whereClause);
	/*
	devise_dao_sqlite.get_devises_by_WhereClause(whereClause,function(err,devises){
		   if(err) {
			   console.log("err="+err);
	       }
		   res.send(devises);
	});//end of get_devises_by_WhereClause()
	*/

	/*
	devise_dao_sqlite.get_devises_by_WhereClause(whereClause)
	.then((devises)=>{ res.send(devises);})
	.catch((err)=>{console.log(err) })
	*/
    try {
	   //Rappel : await ne peut être utilisé que depuis une fonction préfixée par async
	   let devises = await devise_dao_sqlite.get_devises_by_WhereClause(whereClause);
	   res.send(devises);
	}catch(err){
		console.log(err);
	}

});


// http://localhost:8282/devise-api/private/role-admin/devise en mode post
// avec { "code" : "mxy" , "nom" : "monnaieXy" , "change" : 123 } dans req.body
apiRouter.route('/devise-api/private/role-admin/devise')
.post( function(req , res  , next ) {
	var nouvelleDevise = req.body;
	console.log("POST,nouvelleDevise="+JSON.stringify(nouvelleDevise));
	devise_dao_sqlite.insert_new_devise (nouvelleDevise,
									     function(err){
											 if(err==null)
											   res.send(nouvelleDevise);
											 else 
											   res.status(500).send({err : "cannot insert in database" ,
											                         cause : err});
									    });
});

// http://localhost:8282/devise-api/private/role-admin/devise en mode PUT
// avec { "code" : "USD" , "nom" : "Dollar" , "change" : 1.123 } dans req.body
apiRouter.route('/devise-api/private/role-admin/devise')
.put( function(req , res  , next ) {
	var newValueOfDeviseToUpdate = req.body;
	console.log("PUT,newValueOfDeviseToUpdate="+JSON.stringify(newValueOfDeviseToUpdate));
	devise_dao_sqlite.update_devise (newValueOfDeviseToUpdate ,
		function(err,nbChanges){
			if(err || nbChanges ==0){
				res.status(404).json({ err : "no devise to update with code=" + newValueOfDeviseToUpdate.code });
			}else{
					res.send(newValueOfDeviseToUpdate);
			 }
	});	//end of update_devise()
});

// http://localhost:8282/devise-api/private/role-admin/devise/EUR en mode DELETE
apiRouter.route('/devise-api/private/role-admin/devise/:code')
.delete( function(req , res  , next ) {
	var codeDevise = req.params.code;
	console.log("DELETE,codeDevise="+codeDevise);
	devise_dao_sqlite.delete_devise_by_code( codeDevise ,
		function(err,nbChanges){
            if(err || nbChanges ==0)
					 res.status(404).send({ err : "not found , no delete" } );
				 else
					 res.send({ deletedDeviseCode : codeDevise } );
			 });
});

exports.apiRouter = apiRouter;