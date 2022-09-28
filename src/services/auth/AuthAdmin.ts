import { Response, Request } from 'express';
import { DataUser, generateToken } from '../../lib/jwt';
import mysqli from "../../lib/mysqli";
import response from '../../lib/response';
import Admin from '../../model/Admin';


class AuthAdmin {

    static login(req:Request, res:Response){

        const email = req.body.email
        const senha = req.body.senha
        const remem = req.body.rememberme

        const conn = mysqli()

        try {
            let query = 
                    `SELECT 
                        user.id,
                        user.nome,
                        user.sobrenome,
                        user.email,
                        user.ativo,
                        admin.slug
                    FROM user 
                    JOIN admin ON admin.user_id = user.id
                        WHERE user.email = ?
                        AND   user.senha = ?
                        AND   user.ativo = 1`;

            conn.query(query, [email, senha], (err, result) => {
                
                if(result.length > 0){
                    
                    const message = result[0]
                    const user = {
                        id:message.id,
                        nome:message.nome,
                        sobrenome:message.sobrenome,
                        email:message.email,
                        ativo:message.ativo == 1
                    } 
                    const admin = new Admin(user)
                    admin.setSlug(message.slug)
                    message.session = generateToken("Admin", admin)
                    
                    if(remem){
                        message.remembermetk = admin.getRememberMeToken()
                        conn.query("INSERT INTO user_devices (user_id, rememberme) VALUES (?,?)", [message.id, message.remembermetk])
                    }
                    response(res).success(message)
                } else {
                    response(res).error(404, 'Not Found')
                }
                conn.end()
                
            })
        } catch (error) {
            response(res).error(500, 'Internal Error')
            conn.end()
        }

    }

}

export default AuthAdmin