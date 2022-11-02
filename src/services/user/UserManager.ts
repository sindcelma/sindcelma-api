import { Request, Response } from "express";
import mysqli from "../../lib/mysqli";
import response from "../../lib/response";

class UserManager {

    public static check_email(req:Request, res:Response){
        const conn = mysqli()
        let email  = req.body.email

        if(!email) return response(res).error(401, 'Unauthorized') 

        conn.query(
            `SELECT 
                user.id
            FROM user 
            WHERE
                user.email = ?`, 
        [email], (err, result) => {
            
            conn.end()
            
            if(err) return response(res).error(500, 'Interal Error')
            if(result.length == 0) return response(res).success(email)
            return response(res).error(401, 'Unauthorized')
            
        })
    }

    public static _update_user(email:String, senha:String, fn:(err:any, result:any) => void){
        
    }

    public static _save_user(email:String, senha:String, fn:(err:any, result:any) => void){
        
        const conn = mysqli()
        conn.query("INSERT INTO user (email, senha) VALUES (?,?)", [], (err, result) => fn(err, result))

    }

    public static create_user(req:Request, res:Response){

    }

}

export default UserManager;