import { Request } from 'express';
import { Db } from 'mongodb';

export interface User{
    id?: number,
    name: string,
    gender: string,
    county: string,
    interests: UserInterest[],
}

export interface UserInterest{
    id?: number,
    name: string,
    type: string,
}

/**
 * UserController Class used to interface with User objects and the User database table
 */
export class UserController{
    private _totalUsers: number;
    public page: number;
    public perpage: number;

    constructor(
        private req: Request,
        private db: Db,
    ){
        this.page = parseInt(req.params.page || 1);
        this.perpage = parseInt(req.params.perpage || 20);

    }

    getUsers(){

    }

    /**
     * Parse a supplied CSV into Users and save to db
     * @param csv string
     * @return success boolean
     */
    saveUsersCsv(csv: string){
        let users = this.csvToUser(csv);
        if(users.length){
            return this.saveUsers(users);
        }
        return false;
    }

    /**
     * Save a supplied list of Users[] to the db
     * @param users
     * @return success boolean
     */
    saveUsers(users: User[]){

        return false;
    }

    totalUsers(){

    }

    getForPage(){

    }

    /**
     * Function to convert a CSV string to a list of Users
     * TODO: CSV validation for columns and column name
     * TODO: Add other types of Interests
     * TODO: validate/auto-correct county
     * @param csvText
     * @return User[]
     */
    csvToUser(csvText: string){
        const lines = csvText.split(/\r\n|\n/);
        const headers = lines[0].split(/\t|,/);
        let users = [];

        lines.map(line =>{
            const data = line.split(/\t|,/);

            if (data.length == headers.length) {
                let user = <User>{
                    id: parseInt(data[0]),
                    name: data[1],
                    gender: data[2],
                    county: data[3],
                    interests: []
                };
                data[4].split(/,/).map(interest => {
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