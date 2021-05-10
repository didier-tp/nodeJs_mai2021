var express = require('express');
var app = express();

//avec cette config , une url en http://localhost:8282/public/p1.html
// renverra le fichier p1.html rangé dans le sous répertoire public
// de l'application myNodeServer
app.use('/public', express.static(__dirname+"/public"));

//route principale:
app.get('/', function(req, res , next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<html> <body>");
    res.write('<h2>welcome to basic_http_server</h2>');
    res.write('<!-- <a href="addition?a=5&b=6">5+6</a><br/> -->');
    res.write("<form method='get' action='addition'>");
    res.write("valeur de a? :<input name='a'/><br/>");
    res.write("valeur de b? :<input name='b'/><br/>");
    res.write("<input type='submit' value='calculer a+b'/>");
    res.write("</form>");
    res.write("</body></html>");
    res.end();
});

//route pour addition?a=5&b=6
app.get('/addition', function(req, res , next) {
    a = Number(req.query.a);b = Number(req.query.b);
    resAdd = a+b;
    res.setHeader('Content-Type', 'text/html');
    res.write("<html>");
    res.write("<head><link rel='stylesheet' href='./public/styles.css' /> </head>");
    res.write("<body>");
    res.write("<h1>resultat du calcul</h1>")
    res.write('a=' + a + '<br/>');res.write('b=' + b + '<br/>');
    res.write('<p>a+b=' + resAdd + '</p>');
    res.write('<a href="/">nouveau calcul</a>');
    res.write("</body></html>");
    res.end();
});

app.listen(8282 , function () {
    console.log("http://localhost:8282");
});