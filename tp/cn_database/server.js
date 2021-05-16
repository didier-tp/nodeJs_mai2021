var express = require('express');
//var deviseApiRoutes = require('./devise-api-routes_v1_sans_mongo');
//var deviseApiRoutes = require('./devise-api-routes_v2_avec_mongo');
var deviseApiRoutes = require('./devise-api-routes_v3_avec_sqlite');
//var deviseApiRoutes = require('./devise-api-routes_v4_avec_mongoose');
var produitApiRoutes = require('./produit-api-routes_memory');
//var produitApiRoutes = require('./produit-api-routes_sqlite');
//var produitApiRoutes = require('./produit-api-routes_mongoose');
//var bodyParser = require('body-parser');


var apiErrorHandler = require('./apiHandler').apiErrorHandler;

var loginApiRouter = require('./loginApiRoutes').loginApiRouter;
var verif_auth = require('./verif-auth');
var verifTokenInHeadersForPrivatePath = verif_auth.verifTokenInHeadersForPrivatePath;
var secureModeApiRouter = verif_auth.secureModeApiRouter;

var app = express();
//const fileUpload  = require('express-fileupload');

//PRE TRAITEMENTS (à placer en haut de server.js)

//support parsing of JSON post data
//var jsonParser = bodyParser.json()  pour premières version 4.x de express
var jsonParser = express.json() ; //pour versions très récente de express
app.use(jsonParser);

/*
//support for fileUpload:
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 },
}));
*/

// CORS enabled with express/node-js :
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    //ou avec "www.xyz.com" à la place de "*" en production

    res.header("Access-Control-Allow-Methods",
               "POST, GET, PUT, DELETE, OPTIONS"); 
    //default: GET 

    res.header("Access-Control-Allow-Headers",
               "Origin, X-Requested-With, Content-Type, Accept");

    next();
});

//verif auth beared token in request for private api/path:
app.use(verifTokenInHeadersForPrivatePath);


//les routes en /html/... seront gérées par express par
//de simples renvois des fichiers statiques
//du répertoire "./html"
app.use('/html', express.static(__dirname+"/html"));
app.get('/', function(req , res ) {
  res.redirect('/html/index.html');
}); 

app.use(deviseApiRoutes.apiRouter);// delegate REST API routes
app.use(produitApiRoutes.apiRouter);// to apiRouter(s)
app.use(secureModeApiRouter); //dev-only ( http://localhost:8282/auth-api/dev-only/secure/true or false)
app.use(loginApiRouter);

//POST TRAITEMENTS (à placer en bas de server.js):

app.use(apiErrorHandler); //pour gérer les erreurs/exceptions
                          //automatiquement rattrapées .then().catch() de asyncToResp ./apiHandler.js

const server = app.listen(8282 , function () {
  console.log("http://localhost:8282");
  //ou bien process.env.PORT (avec set PORT=8282 dans .bat de lancement)  
});

const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('selfsigned.key'),
  cert: fs.readFileSync('selfsigned.crt')
};

https.createServer(options, app).listen(8443,
  function () {
    console.log("https://localhost:8443");
  });

module.exports.app = app;
module.exports.server = server;