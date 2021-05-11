var express = require('express');

var app = express();

app.use('/css', express.static(__dirname+"/css"));//css interprété coté navigateur
app.use('/js', express.static(__dirname+"/js")); //script coté navigateur 

app.set('view engine', 'pug'); //nécessite npm install -s pug 

app.get('/', function(req , res ) {
  res.redirect('/server-home');
});

app.get('/server-home', function(req , res ) {
   res.render('server-home');
    //rendering views/server-home.pug 
});

app.get('/calcul', function(req , res ) {
    res.render('calcul'); //views/calcul.pug
});

//GET addition?a=5&b=6
app.get('/addition', function(req , res ) {
    let va = Number(req.query.a);
    let vb = Number(req.query.b);
    let vaPlusVb = va+vb;
    let listeCouleurs = [ 'rouge' , 'vert' , 'bleu']
    res.render('addResult', {a: va, b: vb, resAdd: vaPlusVb ,
                             couleurs : listeCouleurs });
    //rendering views/addResult.pug with js values 
    //for #{a} , #{b} , #{resAdd} in .pug
});

//GET calculTva?ht=200&taux=20
app.get('/calculTva', function(req , res ) {
    /*
    let vht = req.query.ht?Number(req.query.ht):0;
    let vtaux = req.query.taux?Number(req.query.taux):0; //en %
    let vtva = vht*vtaux/100;
    let vttc = vht + vtva;
    res.render('calculTva', {ht: vht, taux: vtaux, tva: vtva ,
                             ttc : vttc });*/
    let ht = req.query.ht?Number(req.query.ht):0;
    let taux = req.query.taux?Number(req.query.taux):0; //en %
    let tva = ht*taux/100;
    let ttc = ht + tva;
    res.render('calculTva', {ht, taux, tva , ttc });                         
    //rendering views/calculTva.pug with js values 
    // #{tva} , #{ttc} in .pug
});

app.listen(8282 , function () {
    console.log("http://localhost:8282");
});