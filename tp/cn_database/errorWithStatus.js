// ErrorWithStatus est une version améliorée de Error (err.message)
// avec un attribut status (404,500,...) permettant une automatisation
// du retour du status http dans le "apiErrorHandler"

//NB: Error is a very special class (native)
//subclass cannot be test with instanceof , ...

class ErrorWithStatus extends Error {
    constructor(message,status=500){
        super(message);
        this.msg= message;
        this.status=status;
    }
    static extractStatusInNativeError(e /*: Error*/)/*:number*/{
      let status=500; //500 (Internal Server Error)
      let jsonStr = JSON.stringify(e);
      let errWithStatus = JSON.parse(jsonStr);
      if(errWithStatus.status)
         status = errWithStatus.status;
      return status;//500 (by default) or other
    }
 }

 class NotFoundError extends ErrorWithStatus{
     constructor(message="not found",status=404){
         super(message,status);
     }
 }

 class ConflictError extends ErrorWithStatus{
    constructor(message="conflict (with already existing)",
                status=409){
        super(message,status);
    }
}

module.exports.ErrorWithStatus=ErrorWithStatus;
module.exports.NotFoundError=NotFoundError;
module.exports.ConflictError = ConflictError;