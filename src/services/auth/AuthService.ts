import { Request, Response } from "express";
import { DataUser, generateToken } from "../../lib/jwt"
import mysqli from "../../lib/mysqli";
import response from "../../lib/response";

class AuthService {
    
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
                user.nome,
                user.sobrenome,
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
                nome:message.nome,
                sobrenome:message.sobrenome,
                email:message.email,
                ativo:message.ativo == 1
            } 
            
            message.session = generateToken(type, user)
            response(res).success(message)

        })

    }

}

export default AuthService