import { Router, Request, Response } from 'express';
import { Db } from 'mongodb';
import * as multer from 'multer';
import * as fs from 'fs';
import * as csv from 'fast-csv';
import {User, UserController} from "./components/User";

/**
 * API module for all api endpoints
 * @param router express.Router
 * @param db MongoDb.client.db
 * @returns router express.Router
 */
function Api(router: Router){
    const upload = multer({ dest:'/tmp/' });
    
    /* GET users listing. */
    router.get('/users',(req: Request, res: Response) => {
        ( new UserController(req) ).getForPage() // async
            .then((data)=>{
                res.jsonp(data);
            });
    });
    
    /* GET user matches */
    router.get('/users/:id/matches', (req: Request, res: Response) => {
        let userC = new UserController(req);
        let matchedUser:User;
        try{
            userC.getUser() // async
                .then(user => {
                    matchedUser = user;
                    console.log(user);
                    return userC.getMatches(user);
                })
                .then(matches => {
                    let interests = matchedUser.interests.map(i => i.name);
                    matches = matches.filter( (match: User) => {
                        return match.interests.filter(i => 
                            interests.indexOf(i.name) !== -1 
                        ).length > 1;
                    });
                    // TODO: filter data to only/ return at least 2 interest matches
                    res.jsonp({ success: true, matches: matches });
                });
        } catch (e) {
            res.jsonp({ success: false });
        }
    });

    /* POST upload users */
    router.post('/users',upload.single('csv'), function(req: Request, res: Response) {
        const fileRows = [];
        // open uploaded file
        csv.fromPath(req.file.path)
            .on("data", function (data) {
                fileRows.push(data); // push each row
            })
            .on("end", function () {
                fs.unlinkSync(req.file.path); // remove temp file
                if(( new UserController(req) ).saveUsersCsv(fileRows)){
                    res.jsonp({ success: true, message: "Uploaded Successfully" });
                } else {
                    res.jsonp({ success: false, message: "Upload Failed" });
                }
            });
    });

    return router;
}

module.exports = Api;
