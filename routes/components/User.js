"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
        this.perpage = parseInt(req.params.perpage || 200);
        this.selectedId = req.params.id; // used for matches
    }
    /**
     * Gets the current required users for the page
     */
    UserController.prototype.getForPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var users, stats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve(db.collection('users')
                            .find({})
                            .skip(this.page * this.perpage)
                            .limit(this.perpage)
                            .toArray())];
                    case 1:
                        users = _a.sent();
                        return [4 /*yield*/, Promise.resolve(db.collection('users')
                                .stats())];
                    case 2:
                        stats = _a.sent();
                        return [2 /*return*/, { users: users, page: this.page, perpage: this.perpage, total: stats.count }];
                }
            });
        });
    };
    UserController.prototype.getUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve(db.collection('users')
                            .findOne({ _id: mongodb_1.ObjectID(this.selectedId) }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserController.prototype.getMatches = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var userInterests;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userInterests = user.interests.map(function (interest) { return interest.name; });
                        return [4 /*yield*/, Promise.resolve(db.collection('users')
                                .find({
                                "_id": { $ne: mongodb_1.ObjectID(user._id) },
                                "county": user.county,
                                "interests.name": { $in: userInterests }
                            })
                                .toArray())];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
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
                    name: line[0],
                    gender: line[1],
                    county: line[2],
                    interests: []
                };
                line[3].split(/,/).map(function (interest) {
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