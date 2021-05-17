

function setSecurityTokenForAjax(){
	
	var authToken = sessionStorage.getItem("authToken"); 
	              //localStorage.getItem("authToken");

	$(document).ajaxSend(function(e, xhr, options) {
			  //retransmission du jeton d'authentification
			  //dans l'entête http de la requete ajax
			  //xhr = XmlHttpRequest = objet technique du navigateur
			  //qui déclenche les requêtes ajax
  	          xhr.setRequestHeader('Authorization',"Bearer "+ authToken);
  	       });

}

function xhrStatusToErrorMessage(jqXHR){
	var errMsg = "ajax error";//by default
	var detailsMsg=""; //by default
	console.log("jqXHR.status="+jqXHR.status);
	switch(jqXHR.status){
		case 400 : 
			errMsg = "Server understood the request, but request content was invalid."; 
			if(jqXHR.responseText!=null) 
				detailsMsg = jqXHR.responseText;
			break;
		case 401 : 
			errMsg = "Unauthorized access (401)"; break;
		case 403 : 
			errMsg = "Forbidden resource can't be accessed (403)"; break;
		case 404 : 
			errMsg = "resource not found (404)"; break;
		case 500 : 
			errMsg = "Internal server error (500)"; break;
		case 503 : 
			errMsg = "Service unavailable (503)"; break;
	}
	return errMsg+" "+detailsMsg;
}