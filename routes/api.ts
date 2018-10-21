import { Router, Request, Response } from 'express';
import { Db } from 'mongodb';
import * as _ from 'lodash';
import {UserController} from "./components/User";


/**
 * API module for all api endpoints
 * @param router express.Router
 * @param db MongoDb.client.db
 * @returns router express.Router
 */
function Api(router: Router, db: Db){
    /* GET users listing. */
    router.get('/users', function(req: Request, res: Response) {
        const userC = new UserController(req, db);

        res.jsonp([]);
    });

    /* POST upload users */
    router.post('/users', function(req: Request, res: Response) {

        res.jsonp({ success: true, message: "Uploaded Successfully" });
    });

    return router;
}

module.exports = Api;
