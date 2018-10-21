"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
var assert = require("assert");
var db = null;
var client = new mongodb_1.MongoClient('mongodb://localhost:27017');
client.connect(function (err) {
    assert.equal(null, err);
    db = client.db('close-to-home');
});
/**
 * UserController Class used to interface with User objects and the User database table
 */
var UserController = /** @class */ (function () {
    function UserController(req) {
        this.req = req;
        this.page = parseInt(req.params.page || 0); //zero indexed
        this.perpage = parseInt(req.params.perpage || 20);
    }
    /**
     * Gets the current required users for the page
     */
    UserController.prototype.getForPage = function () {
        return this.getUsers(this.page * this.perpage, this.perpage);
    };
    UserController.prototype.getUsers = function (skip, limit) {
        if (skip === void 0) { skip = 0; }
        if (limit === void 0) { limit = 20; }
        return db.collection('users')
            .find()
            .skip(skip)
            .limit(limit);
    };
    /**
     * Parse a supplied CSV into Users and save to db
     * @param csv string
     * @return success boolean
     */
    UserController.prototype.saveUsersCsv = function (csv) {
        var users = this.csvToUser(csv);
        if (users.length) {
            return db.collection('users').insertMany(users).then(function (x) {
                return x.result.ok;
            });
        }
        return false;
    };
    UserController.prototype.totalUsers = function () {
        return db.collection('users').totalSize;
    };
    /**
     * Function to convert a CSV string to a list of Users
     * TODO: CSV validation for columns and column name
     * @param csvText
     * @return User[]
     */
    UserController.prototype.csvToUser = function (csvText) {
        var lines = csvText;
        var headers = lines[0];
        var users = [];
        lines.splice(0, 1);
        // i am assuming csv data integrity to save time
        lines.map(function (line) {
            if (line.length == headers.length) {
                var user_1 = {
                    id: parseInt(line[0]),
                    name: line[1],
                    gender: line[2],
                    county: line[3],
                    interests: []
                };
                line[4].split(/,/).map(function (interest) {
                    user_1.interests.push({
                        name: interest,
                        type: "Sport"
                    });
                });
                users.push(user_1);
            }
        });
        return users;
    };
    return UserController;
}());
exports.UserController = UserController;
//# sourceMappingURL=User.js.map