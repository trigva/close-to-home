"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var multer = require("multer");
var fs = require("fs");
var csv = require("fast-csv");
var User_1 = require("./components/User");
/**
 * API module for all api endpoints
 * @param router express.Router
 * @param db MongoDb.client.db
 * @returns router express.Router
 */
function Api(router) {
    var upload = multer({ dest: '/tmp/' });
    /* GET users listing. */
    router.get('/users', function (req, res) {
        var userC = new User_1.UserController(req);
        res.jsonp(userC.getForPage());
    });
    /* POST upload users */
    router.post('/users', upload.single('csv'), function (req, res) {
        var userC = new User_1.UserController(req);
        var fileRows = [];
        // open uploaded file
        csv.fromPath(req.file.path)
            .on("data", function (data) {
            fileRows.push(data); // push each row
        })
            .on("end", function () {
            fs.unlinkSync(req.file.path); // remove temp file
            userC.saveUsersCsv(fileRows);
            res.jsonp({ success: true, message: "Uploaded Successfully" });
        });
    });
    return router;
}
module.exports = Api;
//# sourceMappingURL=api.js.map