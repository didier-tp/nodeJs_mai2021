var ErrorWithStatus = require('./errorWithStatus').ErrorWithStatus;

function apiErrorHandler (err, req, res, next) {
    console.log("in apiErrorHandler err=", err + " " + JSON.stringify(err));
    console.log("in apiErrorHandler typeof err=",typeof err);
    if(typeof err == 'string'){
        res.status(500).json({errorCode:'500', message: 'Internal Server Error :' + err});
    }
    else if(err instanceof Error){
      //console.log("in apiErrorHandler err is instanceof Error");
      let status = ErrorWithStatus.extractStatusInNativeError(err);
      res.status(status).json(
          {errorCode:`${status}`, message: err.message});
  }
    else
      res.status(500).json({errorCode:'500', message: 'Internal Server Error'});
}

function asyncToResp(fn) {
    return function(req, res , next) {
      // Make sure to `.catch()` any errors and pass them along to the `next()`
      // middleware in the chain, in this case the error handler.
      fn(req, res, next)
      .then((data)=> { res.send(data) })
      .catch(next);
    };
  }

  module.exports.asyncToResp = asyncToResp;
  module.exports.apiErrorHandler=apiErrorHandler;

  //exemple d'utilisation:
  /*
deviseApiRouter.route('/devise/:code')
.get(asyncToResp(async function(req , res , next){
    let codeDevise = req.params.code;
    let devise = await deviseService.findById(codeDevise)
    return devise;
}));
  */