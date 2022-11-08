import { Request, Response } from "express";
import { dateFormat } from "../../lib/data";
import { generateToken, generateCode, hashPass } from "../../lib/jwt"
import mysqli from "../../lib/mysqli";
import response from "../../lib/response";
import Socio from "../../model/Socio";
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
            
            const token = generateToken(type, {
                id:user.getId(),
                email:user.getEmail(),
                version:user.getVersion()
            })

            const message:msg = {
                session: token,
                user:user
            }

            message.session = token
                    
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
        let cpf = Socio.transformCpf(req.body.doc) 
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
            JOIN user ON socios.id = user.socio_id 
            JOIN socios_dados_pessoais ON socios_dados_pessoais.socio_id = socios.id 
            WHERE socios.cpf = ?
            `, 
            [cpf]
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
                return response(res).error(500, 'Internal Error 1') 
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
            `, [resUser.id, limite, code], (err2) => {

                if(err2){ 
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
    
                response(res).success({
                    email:resUser.email
                })

            })

        })

    }
    
    /**
     * testado: false
     */
    public static check_code_recover(req:Request, res:Response) {
        
        const email  = req.body.email;
        const codigo = req.body.codigo;

        if(!email || !codigo) return response(res).error(400, 'Bad Request')

        const conn = mysqli()
        conn.query(`
          SELECT 
                 user_recover.id
            FROM user_recover 
            JOIN user ON user.id = user_recover.user_id 
           WHERE user_recover.codigo = ?
             AND user_recover.data_limite > now()
             AND user.email = ?`, [codigo, email], async (err, result) => {
               
                if(err) return response(res).error(500, 'Server Error 1')
                if(result.length == 0) return response(res).error()
                
                const recover_id = result[0]['id'];
                const slugHashCode = await hashPass(recover_id+codigo+email);

                conn.query("UPDATE user_recover SET codigo = ? WHERE id = ?", [slugHashCode, recover_id], err => {
                   
                    if(err) return response(res).error(500, 'Internal Error')
                    response(res).success({
                        codigo: slugHashCode
                    })
                })

             })

    }


    public static change_pass_using_code(req:Request, res:Response){
        
        const email  = req.body.email;
        const codigo = req.body.codigo;
        const senha  = req.body.senha;

        if(!email || !senha || !codigo) return response(res).error(400, 'Bad Request')

        const conn = mysqli();
        conn.query(`
          SELECT 
                 user_recover.id
            FROM user_recover 
            JOIN user ON user.id = user_recover.user_id 
           WHERE user_recover.codigo = ?
             AND user.email = ?`, [codigo, email], 
             async (err, result) => {

                if(err) return response(res).error(500, 'Server Error 1')
                if(result.length == 0) return response(res).error()
                
                const recover_id = result[0]['id'];
                const pass  = await hashPass(senha);

                conn.query("UPDATE user SET senha = ? WHERE email = ?", [pass, email], err => {
  
                    if(err) return response(res).error(500, 'Internal Error')
                    conn.query("DELETE FROM user_recover WHERE id = ?", [recover_id])
                    response(res).success();
                })

             })

    }

    public static rememberme(req:Request, res:Response){
        
        const remembermeToken = req.body.rememberme
        const type = req.body.type
        
        getUserByRememberme(type, remembermeToken, (user, error, msg) => {
           
            if(error){
                return response(res).error(500, msg)
            }
            
            const message:msg = {
                session: generateToken(type, {
                    id:user.getId(),
                    email:user.getEmail(),
                    version:user.getVersion()
                }),
                user:user
            }

            response(res).success(message)
        })

    }

}

export default AuthService