import { Request } from 'express';
import { MongoClient, Db } from 'mongodb';
import * as assert from 'assert';


let db = null;
let client = new MongoClient('mongodb://localhost:27017');
client.connect(function(err) {
    assert.equal(null, err);

    db = client.db('close-to-home');
});

export interface User{
    _id?: number,
    name: string,
    gender: string,
    county: string,
    interests: UserInterest[],
}

export interface UserInterest{
    name: string,
    type: string,
}

/**
 * UserController Class used to interface with User objects and the User database table
 */
export class UserController{
    public page: number;
    public perpage: number;

    constructor(
        private req: Request,
    ){
        this.page = parseInt(req.params.page || 0); //zero indexed
        this.perpage = parseInt(req.params.perpage || 20);
    }

    /**
     * Gets the current required users for the page
     */
    getForPage(){
        return this.getUsers(this.page * this.perpage, this.perpage);
    }

    getUsers(skip:number=0,limit:number=20){

        return db.collection('users')
                    .find()
                    .skip(skip)
                    .limit(limit);
    }

    /**
     * Parse a supplied CSV into Users and save to db
     * @param csv string
     * @return success boolean
     */
    saveUsersCsv(csv: string[]){
        let users = this.csvToUser(csv);
        if(users.length){
            return db.collection('users').insertMany(users).then(x => {
                return x.result.ok;
            });
        }
        return false;
    }

    totalUsers(){
        return db.collection('users').totalSize;
    }

    /**
     * Function to convert a CSV string to a list of Users
     * TODO: CSV validation for columns and column name
     * @param csvText
     * @return User[]
     */
    csvToUser(csvText: string[]){
        const lines = csvText;
        const headers = lines[0];
        let users = [];

        lines.splice(0,1);

        // i am assuming csv data integrity to save time
        lines.map(line =>{
            if (line.length == headers.length) {
                let user = <User>{
                    id: parseInt(line[0]),
                    name: line[1],
                    gender: line[2],
                    county: line[3],
                    interests: []
                };
                line[4].split(/,/).map(interest => {
                    user.interests.push({
                        name: interest,
                        type: "Sport"
                    })
                });
                users.push(user);
            }
        });
        return users;
    }
}