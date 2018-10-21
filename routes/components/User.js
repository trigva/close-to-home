"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * UserController Class used to interface with User objects and the User database table
 */
var UserController = /** @class */ (function () {
    function UserController(req, db) {
        this.req = req;
        this.db = db;
        this.page = parseInt(req.params.page || 1);
        this.perpage = parseInt(req.params.perpage || 20);
    }
    UserController.prototype.getUsers = function () {
    };
    /**
     * Parse a supplied CSV into Users and save to db
     * @param csv string
     * @return success boolean
     */
    UserController.prototype.saveUsersCsv = function (csv) {
        var users = this.csvToUser(csv);
        if (users.length) {
            return this.saveUsers(users);
        }
        return false;
    };
    /**
     * Save a supplied list of Users[] to the db
     * @param users
     * @return success boolean
     */
    UserController.prototype.saveUsers = function (users) {
        return false;
    };
    UserController.prototype.totalUsers = function () {
    };
    UserController.prototype.getForPage = function () {
    };
    /**
     * Function to convert a CSV string to a list of Users
     * TODO: CSV validation for columns and column name
     * TODO: Add other types of Interests
     * TODO: validate/auto-correct county
     * @param csvText
     * @return User[]
     */
    UserController.prototype.csvToUser = function (csvText) {
        var lines = csvText.split(/\r\n|\n/);
        var headers = lines[0].split(/\t|,/);
        var users = [];
        lines.map(function (line) {
            var data = line.split(/\t|,/);
            if (data.length == headers.length) {
                var user_1 = {
                    id: parseInt(data[0]),
                    name: data[1],
                    gender: data[2],
                    county: data[3],
                    interests: []
                };
                data[4].split(/,/).map(function (interest) {
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