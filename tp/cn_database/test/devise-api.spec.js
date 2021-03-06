var chai = require('chai');
var  chaiHttp = require('chai-http');
var servModule =  require('../server');
var app =  servModule.app;
var server = servModule.server;


// Configure chai
chai.use(chaiHttp);
//chai.should();


describe("devise api", function() {

  before(function(done) {
    // runs before all tests :
    done();
    //...
  });

  after(function() {
    // runs after all tests :
    server.close();
  });

  describe("getDeviseByCode via rest api", function() {

    it("returns status 200 and a devise object with good name", function(done) {
      chai.request(app)
                 .get('/devise-api/public/devise/EUR')
                 .end((err, res) => {
                     //res.should.have.status(200);
                     chai.expect(res).status(200);
                     let obj = res.body;
                     //obj.should.be.a('object');
                     chai.expect(obj).a('object');
                     let devise = obj;
                     //console.log(JSON.stringify(devise));
                     chai.expect(devise.nom).equals("Euro");
                     done();
                  });
    });

  
  });

  

});