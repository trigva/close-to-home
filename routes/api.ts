import { Router, Request, Response } from 'express';
import { Db } from 'mongodb';
import * as multer from 'multer';
import * as fs from 'fs';
import * as csv from 'fast-csv';
import {UserController} from "./components/User";

/**
 * API module for all api endpoints
 * @param router express.Router
 * @param db MongoDb.client.db
 * @returns router express.Router
 */
function Api(router: Router){
    const upload = multer({ dest:'/tmp/' });
    /* GET users listing. */
    router.get('/users',function(req: Request, res: Response) {
        const userC = new UserController(req);
        res.jsonp(userC.getForPage());
    });

    /* POST upload users */
    router.post('/users',upload.single('csv'), function(req: Request, res: Response) {
        const userC = new UserController(req);
        const fileRows = [];
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
