var express = require('express');
var asyncToResp = require('./apiHandler').asyncToResp;

var buildJwtToken = require('./util/jwt-util').buildJwtToken;

const loginApiRouter = express.Router();

var login_dao_sqlite = require('./login-dao-sqlite');

//getting all login (tp , admin only)
// GET http://localhost:8282/login-api/private/role_admin/login renvoyant tout [ {} , {}]
loginApiRouter.route('/login-api/private/role_admin/login')
    .get(asyncToResp(async function (req, res, next) {
        //let  critereXy = req.query.critereXy;
        let loginArray = await login_dao_sqlite.get_logins_by_WhereClause("");
        return loginArray;
    }));

//submitting authRequest (login) via post
//response = authResponse with token:
loginApiRouter.route('/login-api/public/auth')
    .post(asyncToResp(async function (req, res, next) {
        let authReq = req.body; //as javascript object via jsonParser
        console.log("/login-api/public/auth , incoming request:" + JSON.stringify(authReq));
        let authResponse = {
            username: authReq.username,
            status: null, message: null,
            token: null, roles: null
        };
        let login = null;
        try {
            login = await login_dao_sqlite.get_login_by_username(authReq.username);
            console.log("/login-api/public/auth , login:" + JSON.stringify(login));
        } catch (err) {
            authResponse.message = err.message;
        }
        if (login == null) {
            authResponse.message = "login failed (wrong username)";
            authResponse.status = false;
        }
        else {
            if (login.password == authReq.password) {
                let arrayUserRoles = login.roles.split(',');
                let arrayAskedRoles = authReq.roles.split(',');
                let okRoles = true;
                for (let askedRole of arrayAskedRoles) {
                    if (!arrayUserRoles.includes(askedRole))
                        okRoles = false;
                }
                if (okRoles == true) {
                    authResponse.message = "successful login";
                    authResponse.status = true;
                    authResponse.roles = authReq.roles;
                    authResponse.token = buildJwtToken(authReq.username, authReq.roles);
                } else {
                    authResponse.message = "login failed (good username/password but no asked roles=" + authReq.roles + ")";
                    authResponse.status = false;
                }
            } else {
                authResponse.message = "login failed (wrong password)";
                authResponse.status = false;
            }
        }
        console.log("/login-api/public/auth , authResponse:" + JSON.stringify(authResponse));
        return authResponse;
    }));

//posting new user account:
//POST ... with body { "username": "u1" , "password" : "pwdu1" , "roles" : "user" }
loginApiRouter.route('/login-api/private/role_admin/login')
    .post(asyncToResp(async function (req, res, next) {
        let login = req.body; //as javascript object via jsonParser
        let savedLogin = await login_dao_sqlite.insert_new_login(login);
        return savedLogin;
    }));

//updating existing user account:
//PUT ... with body { "username": "u1" , "password" : "pwdU1" , "roles" : "user" }
loginApiRouter.route('/login-api/private/role_admin/login')
    .put(asyncToResp(async function (req, res, next) {
        let login = req.body; //as javascript object
        let updatedLogin = await login_dao_sqlite.update_login(login);
        return updatedLogin;
    }));

// DELETE http://localhost:8282/login-api/private/role_admin/login/user1
loginApiRouter.route('/login-api/private/role_admin/login/:username')
    .delete(asyncToResp(async function (req, res, next) {
        let username = req.params.username;
        await login_dao_sqlite.delete_login_by_username(username)
        return { "action": "Login with username=" + username + " was deleted" };
    }));

module.exports.loginApiRouter = loginApiRouter;

/*

structure de Login  {
   username :string ; //id/pk (may be userId or unique email)
   password :string ; //may be stored as crypted password
   roles :string ; //ex: null or "admin,user" or "user" or ...
}

*/


