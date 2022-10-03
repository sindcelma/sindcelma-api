import { Request, Response } from "express";
import { DataUser, generateToken } from "../../lib/jwt"
import mysqli from "../../lib/mysqli";
import response from "../../lib/response";
import User from "../../model/User";
import { getUser } from '../../model/UserFactory'



class AuthService {

    static login(req:Request, res:Response){

        const email = req.body.email
        const senha = req.body.senha
        const remem = req.body.rememberme
        const type  = req.body.type

        getUser(type, email, senha, (user, error) => {

            if(error){
                return response(res).error(500, 'Internal Error')
            }
            
            interface msg { session:String, user:User, remembermetk?:any }
            
            const message:msg = {
                session: generateToken(type, user),
                user:user
            }

            message.session = generateToken(type, user)
                    
            if(remem){
                let conn = mysqli()
                message.remembermetk = user.getRememberMeToken()
                conn.query("INSERT INTO user_devices (user_id, header, rememberme) VALUES (?,?,?)", [user.getId(), user.getAgent(), message.remembermetk])
            }
            
            return response(res).success(message)

        }, remem)

    }

    public static checkCode(req:Request, res:Response){
        
    }

    public static forgotMyPass(req:Request, res:Response){

    }
    
    public static rememberme(req:Request, res:Response){
        
        const remembermeToken = req.body.rememberme
        const type = req.body.type
        const con = mysqli()
        
        const join = 
            type == 'Admin' 
            ? `JOIN admin  ON  admin.user_id = user.id`
            : `JOIN socios ON socios.user_id = user.id`

        const query = `
            SELECT 
                user.id,
                user.email,
                user.ativo
            FROM user_devices
            JOIN user ON user.id = user_devices.user_id 
            ${join}
            WHERE user_devices.rememberme = ?`
        ;

        
        con.query(query, [ remembermeToken ], (err, result) => {
            
            if(err){
                return response(res).error(500, 'Internal Error')
            }

            if(result.length == 0){
                return response(res).error(404, 'Not Found')
            }
            
            const message = result[0]
            const user:DataUser = {
                id:message.id,
                email:message.email,
                ativo:message.ativo == 1
            } 
            
            message.session = generateToken(type, user)
            response(res).success(message)

        })

    }

}

export default AuthService