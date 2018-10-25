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
        (new User_1.UserController(req)).getForPage() // async
            .then(function (data) {
            res.jsonp(data);
        });
    });
    /* GET user matches */
    router.get('/users/:id/matches', function (req, res) {
        var userC = new User_1.UserController(req);
        var matchedUser;
        try {
            userC.getUser() // async
                .then(function (user) {
                matchedUser = user;
                return userC.getMatches(user);
            })
                .then(function (matches) {
                var interests = matchedUser.interests.map(function (i) { return i.name; });
                matches = matches.filter(function (match) {
                    return match.interests.filter(function (i) {
                        return interests.indexOf(i.name) !== -1;
                    }).length > 1;
                });
                // TODO: filter data to only/ return at least 2 interest matches
                res.jsonp({ success: true, matches: matches });
            });
        }
        catch (e) {
            res.jsonp({ success: false });
        }
    });
    /* POST upload users */
    router.post('/users', upload.single('csv'), function (req, res) {
        var fileRows = [];
        // open uploaded file
        csv.fromPath(req.file.path)
            .on("data", function (data) {
            fileRows.push(data); // push each row
        })
            .on("end", function () {
            fs.unlinkSync(req.file.path); // remove temp file
            if ((new User_1.UserController(req)).saveUsersCsv(fileRows)) {
                res.jsonp({ success: true, message: "Uploaded Successfully" });
            }
            else {
                res.jsonp({ success: false, message: "Upload Failed" });
            }
        });
    });
    return router;
}
module.exports = Api;
//# sourceMappingURL=api.js.map