import { Request, Response } from "express";
import { DataUser, generateToken } from "../../lib/jwt"
import mysqli from "../../lib/mysqli";
import response from "../../lib/response";
import User from "../../model/User";
import { getUser, getUserByRememberme } from '../../model/UserFactory'

interface msg { session:String, user:User, remembermetk?:any }

class AuthService {

    static login(req:Request, res:Response){

        const email = req.body.email
        const senha = req.body.senha
        const remem = req.body.rememberme
        const type  = req.body.type

        getUser(type, email, senha, (user, error, msg) => {

            if(error){
                return response(res).error(500, msg)
            }
            
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
        
        getUserByRememberme(type, remembermeToken, (user, error, msg) => {
           
            if(error){
                return response(res).error(500, msg)
            }
            
            const message:msg = {
                session: generateToken(type, user),
                user:user
            }

            response(res).success(message)
        })

    }

}

export default AuthService