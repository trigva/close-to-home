"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User_1 = require("./components/User");
/**
 * API module for all api endpoints
 * @param router express.Router
 * @param db MongoDb.client.db
 * @returns router express.Router
 */
function Api(router, db) {
    /* GET users listing. */
    router.get('/users', function (req, res) {
        var userC = new User_1.UserController(req, db);
        res.jsonp([]);
    });
    /* POST upload users */
    router.post('/users', function (req, res) {
        res.jsonp({ success: true, message: "Uploaded Successfully" });
    });
    return router;
}
module.exports = Api;
//# sourceMappingURL=api.js.map