import { Request, Response } from "express";
import mysqli from "../../lib/mysqli";
import response from "../../lib/response";

class UserManager {


    public static close_all_sessions(req:Request, res:Response){
        
        // apenas administradores ou usuários com a mesma sessão

        const user_id = req.body.user_id

        if(!user_id) return response(res).error(401, 'Unauthorized') 
        
        const conn = mysqli()

        conn.query("UPDATE user SET version = version + 1 WHERE id = ?", [user_id], err => {
            
            if(err) return response(res).error(500, 'internal error');
            
            conn.query("DELETE FROM user_devices WHERE user_id = ?", [user_id], err => {
                if(err) return response(res).error(500, 'internal error');
                response(res).success()
            })

        })

    }

    public static check_email(req:Request, res:Response){
        
        const email  = req.body.email

        if(!email) return response(res).error(401, 'Unauthorized') 
        
        const conn = mysqli()
        conn.query(
            `SELECT 
                id,
                ativo
            FROM user 
            WHERE
                email = ?`, 
        [email], (err, result) => {
            
            if(err) return response(res).error(500, 'Interal Error 2')
            
            if(result.length > 0){
                let user = result[0];

                if(user.ativo == 0) {
                    conn.query("DELETE FROM user WHERE email = ?", [email])
                    return response(res).success(email)
                }
                return response(res).error(401, 'Este email já está em uso')
            }

            return response(res).success(email)
            
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