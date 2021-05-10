var express = require('express');

var app = express();

app.use('/css', express.static(__dirname+"/css"));

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
    res.render('addResult', {a: va, b: vb, resAdd: vaPlusVb });
    //rendering views/addResult.pug with js values 
    //for #{a} , #{b} , #{resAdd} in .pug
});

app.listen(8282 , function () {
    console.log("http://localhost:8282");
});