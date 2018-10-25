import { Request } from 'express';
import { MongoClient, Db, ObjectID } from 'mongodb';
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

export interface UserPage{
    page: number,
    perpage: number,
    users: User[],
    total: number
}

/**
 * UserController Class used to interface with User objects and the User database table
 */
export class UserController{
    public page: number;
    public perpage: number;
    public selectedId: number;

    constructor(
        private req: Request,
    ){
        this.page = parseInt(req.params.page || 0); //zero indexed
        this.perpage = parseInt(req.params.perpage || 200);
        this.selectedId = req.params.id; // used for matches
    }

    /**
     * Gets the current required users for the page
     */
    async getForPage(){
        let users = await Promise.resolve(
            db.collection('users')
                .find({})
                .skip(this.page * this.perpage)
                .limit(this.perpage)
                .toArray()
        );
        let stats = await Promise.resolve(
            db.collection('users')
                .stats()
        );
        return <UserPage>{ users: users, page: this.page, perpage: this.perpage, total: stats.count };
    }
    
    async getUser(){
        return await Promise.resolve(
            db.collection('users')
                .findOne({_id: ObjectID(this.selectedId)})
        );
    }
    
    async getMatches(user: User){
        const userInterests = user.interests.map(interest => interest.name);
        return await Promise.resolve(
            db.collection('users')
                .find({
                    "_id": { $ne: ObjectID(user._id) },
                    "county": user.county,
                    "interests.name": {$in: userInterests }
                })
                .toArray()
        );
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
                    name: line[0],
                    gender: line[1],
                    county: line[2],
                    interests: []
                };
                line[3].split(/,/).map(interest => {
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