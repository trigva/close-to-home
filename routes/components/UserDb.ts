import { Db, Collection } from 'mongodb';
import { User, UserInterest } from "./User";

export class UserDb{
    private users: Collection;
    private interests: Collection;
    private userInterests: Collection;
    constructor(
        private db: Db,
    ){
        this.users = db.collection('users');
        this.interests = db.collection('interests');
        this.userInterests = db.collection('userInterests');
    }

    saveUsers(users: User[]){
        //1. separate User to basic tables
        //2. save separately
        //3. re-combine
        //3. return combined set

    }

    getUsers(skip:number = 0, limit:number = 500){
        let users = this.users.find().skip(skip).limit(limit);

    }
}