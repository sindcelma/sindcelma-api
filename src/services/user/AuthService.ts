import { Request, Response } from "express";
import { dateFormat } from "../../lib/data";
import { generateToken, generateCode, verifyToken } from "../../lib/jwt"
import mysqli from "../../lib/mysqli";
import response from "../../lib/response";
import User from "../../model/User";
import { getUser, getUserByRememberme } from '../../model/UserFactory'

interface msg { session:String, user:User, remembermetk?:any }

class AuthService {

    // função de teste. apagar depois
    static check_session(req:Request, res:Response){
        response(res).success({
            "status":req.user
        })
    }

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
                conn.query(
                    "INSERT INTO user_devices (user_id, header, rememberme) VALUES (?,?,?)", 
                    [user.getId(), user.getAgent(), message.remembermetk]
                )
            }
            
            return response(res).success(message)

        }, remem)

    }

    /**
     * testado: false
     */
    public static recover(req:Request, res:Response){
        // gerar o código e enviar via email ou telefone
        let email = req.body.email
        let cpf = req.body.cpf 
        let type = req.body.type
        let to = req.body.to

        const conn = mysqli()

        const query:Array<String|Array<String>> = type == 'Socio' ? 
        [ 
            `
            SELECT 
                user.id, user.email, socios_dados_pessoais.telefone 
            FROM 
                socios 
            JOIN user ON socios.user_id = user.id 
            JOIN socios_dados_pessoais ON socios_dados_pessoais.socio_id = socios.id 
            WHERE user.email = ? OR socios.cpf = ?
            `, 
            [email, cpf]
        ] :
        [
            `SELECT 
                user.id, user.email
            FROM 
                user 
            WHERE user.email = ?`,
            [email]
        ]

        conn.query(String(query[0]), query[1], (err, result) => {
            
            if(err){ 
                conn.end()
                return response(res).error(500, 'Internal Error') 
            }

            if(result.length == 0) { 
                conn.end()
                return response(res).error(404, 'Not Found')
            }
            
            const resUser = result[0]

            let data = new Date()
            data.setHours(data.getHours() + 1)
            const limite = dateFormat(data, 'yyyy-MM-dd H:i:s')
            const code = generateCode()

            conn.query(`
                INSERT INTO user_recover (user_id, data_limite, codigo) VALUES (?,?,?)
            `, [resUser.id, limite, code], (err2, result2) => {

                if(err){ 
                    conn.end()
                    return response(res).error(500, 'Internal Error') 
                }

                if(to == 'email') {
                    // envia por email
                    console.log(code + " eviado por email");
                }
    
                if(to == 'phone'){
                    // envia por telefone
                    console.log(code + " eviado por msg");
                }
    
                response(res).success()

            })

        })

    }
    
    /**
     * testado: false
     */
    public static check_code_recover(req:Request, res:Response){
        
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