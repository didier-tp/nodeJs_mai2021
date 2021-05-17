
//dans le jargon nodeJs , 
//ces traitements supplémentaires sont appelés "middleware"

function displayHeaders(req, res, next) {
    //console.log(JSON.stringify(req.headers));
    var authorization = req.headers.authorization;
    console.log("Authorization: " + authorization);
    next();
    }

module.exports.displayHeaders = displayHeaders;    