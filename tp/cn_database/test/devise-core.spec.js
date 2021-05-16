
var chai = require('chai');
var expect = chai.expect;

var devise_dao_sqlite = require('../devise-dao-sqlite');



describe("internal deviseService", function() {

  before( async function() {
    // runs before all tests :
    //insertion d'un jeu de données ou bien autres initialisations 
    devise_dao_sqlite.init_devise_db();            
  });
    
  describe("getAllDevises with get_devises_by_WhereClause", function() {
    it("returning at least 4 devises", async function() {
      let devises = await devise_dao_sqlite.get_devises_by_WhereClause("");
      expect(devises.length).to.gte(4); //greater or equals
    });
  });

  describe("get_devise_by_code", function() {
   it("euro for code EUR", async function() {
      let deviseEur = await devise_dao_sqlite.get_devise_by_code("EUR");
      console.log("deviseEur:"+JSON.stringify(deviseEur));
      expect(deviseEur.nom).equals("Euro");
    });
    

   it("insert_et_getByIdEnchaine", async function() {
    try{
      let nouvelleDev = { code : "Da1" , nom : "devise a1" , change : 123};
      //let nouvelleDev :Devise = { code : "Da1Wrong" , nom : "devise a1" , change : 123};
      let dEnregistree = await devise_dao_sqlite.insertNewDevise(nouvelleDev);
      let deviseRelue = await devise_dao_sqlite.get_devise_by_code("Da1");
      console.log("deviseRelue (after insertNewDevise):"+JSON.stringify(deviseRelue));
      expect(deviseRelue.nom).equals("devise a1");
      //supprimer la devise (pour ne pas perturber le prochain lancement):
      await devise_dao_sqlite.deleteDeviseByCode("Da1");
    }
    catch(err){ 
      console.log("err:" + err); 
       throw err;
      }             
  });

  });

  

});