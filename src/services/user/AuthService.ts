import { Request, Response } from "express";
import { dateFormat } from "../../lib/data";
import { generateToken, generateCode, generateSlug, hashPass, comparePass } from "../../lib/jwt"
import mysqli from "../../lib/mysqli";
import response from "../../lib/response";
import Socio from "../../model/Socio";
import User from "../../model/User";
import { getUser, getUserByRememberme } from '../../model/UserFactory'
import AwsService from "../../lib/aws";
import fs from 'fs'
import { join } from "path";
import Config from '../../lib/config';
import Admin from "../../model/Admin";

interface msg { session:String, user:User, remembermetk?:any }

class AuthService {


    static generate_temp_key(req:Request, res:Response){

        const senha = req.body.senha;

        if(!senha) return response(res).error(400)

        const user:User = req.user;
        
        if(user instanceof Admin && (user as Admin).isMaster()){
            return response(res).error(403, 'Não é permitido alterar dados de Usuário Master')
        }

        const conn = mysqli();

        conn.query(`
            SELECT id, senha FROM user WHERE email = ?
        `, [user.getEmail()], async (err, result) => {
            
            if(err) return response(res).error(500, 'Internal Error')
            if(result.length == 0) return response(res).error(404, 'usuario não encontrado')
            
            const senhaHash = result[0]['senha']
            const user_id   = result[0]['id']

            if(!(await comparePass(senha, senhaHash))) 
                return response(res).error(402, 'senha incorreta')

            
            const data:Date = new Date();
            const key = generateSlug(user.getEmail()+String(data.getMilliseconds()))
            data.setMinutes(data.getMinutes() + 60);

            const dataStr = data.getUTCFullYear() + '-' +
                    ('00' + (data.getUTCMonth()+1)).slice(-2) + '-' +
                    ('00' + data.getUTCDate()).slice(-2) + ' ' + 
                    ('00' + data.getUTCHours()).slice(-2) + ':' + 
                    ('00' + data.getUTCMinutes()).slice(-2) + ':' + 
                    ('00' + data.getUTCSeconds()).slice(-2);

            conn.query("UPDATE user SET temp_key = ?, valid_key = ? WHERE id = ?", 
            [key, dataStr, user_id], err => {

                if(err) return response(res).error(500, 'Internal Error')

                response(res).success({
                    key:key
                });

            })
            
        });

    }

    public static change_password(req:Request, res:Response) {
        // alterar versão do usuário
        let oldPass = req.body.oldPass
        let newPass = req.body.newPass

        if(!req.body.key || !newPass || !oldPass){
            return response(res).error(400, 'bad request')
        }

        let user:User  = req.user 

        const conn = mysqli()
        
        conn.query(`
            SELECT temp_key, senha
            FROM   user
            WHERE  id = ?
        `, [user.getId()], async (err1, result) => {
            
            if(err1) {
                return response(res).error(500, err1)
            }

            if(result.length == 0){
                return response(res).error(404, 'Not Found')
            }
            
            if(req.body.key != result[0].temp_key){
                return response(res).error(403, 'need refresh key')
            }

            if(!(await comparePass(oldPass, result[0].senha))){
                return response(res).error(402, 'senha incorreta')
            }
            const hashNewPass = await hashPass(newPass);

            conn.query("UPDATE user SET senha = ? WHERE id = ?", [hashNewPass, user.getId()], err2 => {
                if(err2){
                    return response(res).error(500, 'Este email já está cadastrado')
                }
                conn.query("DELETE FROM user_devices WHERE user_id = ?", [user.getId()])
                conn.query("UPDATE user SET version = version+1 WHERE id = ?", [user.getId()])
                response(res).success()
            })

        })
    }

    static get_user(req:Request, res:Response){
        response(res).success(req.user)
    }

    static login(req:Request, res:Response){

        const email = req.body.email
        const senha = req.body.senha
        const remem = req.body.rememberme
        const type  = req.body.type

        getUser(type, email, senha, async (user, error, msg) => {

            await new Promise(r => setTimeout(r, 1500));

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
        // alterar versão do usuário
        let email = req.body.email
        let cpf = Socio.transformCpf(req.body.doc) 
        let type = req.body.type
        let to = req.body.to
        
        const conn = mysqli()

        const query:Array<String|Array<String>> = type == 'Socio' ? 
        [ 
            `
            SELECT 
                user.id, user.email, socios.nome, socios_dados_pessoais.telefone 
            FROM 
                socios 
            JOIN user ON socios.id = user.socio_id 
            LEFT JOIN socios_dados_pessoais ON socios_dados_pessoais.socio_id = socios.id 
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
                return response(res).error(500, 'Internal Error 1') 
            }

            if(result.length == 0) { 
                return response(res).error(404, 'Not Found')
            }
            
            const resUser = result[0]

            let data = new Date()
            data.setHours(data.getHours() + 4)
            const limite = dateFormat(data, 'yyyy-MM-dd H:i:s')
            const code = generateCode()

            conn.query(`
                INSERT INTO user_recover (user_id, data_limite, codigo) VALUES (?,?,?)
            `, [resUser.id, limite, code], (err2) => {

                if(err2){ 
                    return response(res).error(500, 'Internal Error') 
                }

                if(to == 'email') {
                    
                    new AwsService().ses()
                    .config({
                        de:Config.instance().getEmailSystem(),
                        para:resUser.email,
                        assunto:"Recuperação de senha",
                        data:{
                            nome:resUser.nome ?? '',
                            codigo:code
                        }
                    })
                    .setTemplate(fs.readFileSync(join(__dirname, '../../html/recover.html')).toString())
                    .send()
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
                 user.id as user_id,
                 user_recover.id
            FROM user_recover 
            JOIN user ON user.id = user_recover.user_id 
           WHERE user_recover.codigo = ?
             AND user.email = ?`, [codigo, email], 
            async (err, result) => {

                if(err) return response(res).error(500, 'Server Error 1')
                if(result.length == 0) return response(res).error()
                
                const recover_id = result[0]['id'];
                const user_id    = result[0]['user_id'];
                const pass  = await hashPass(senha);

                conn.query("UPDATE user SET senha = ? WHERE email = ?", [pass, email], err => {
  
                    if(err) return response(res).error(500, 'Internal Error')
                    conn.query("DELETE FROM user_recover WHERE id = ?", [recover_id])
                    conn.query("DELETE FROM user_devices WHERE user_id = ?", [user_id])
                    conn.query("UPDATE user SET version = version+1 WHERE id = ?", [user_id])
                    response(res).success();
                
                })

            })

    }

    public static rememberme(req:Request, res:Response){
        
        const remembermeToken = req.body.rememberme
        const type = req.body.type
        
        getUserByRememberme(type, remembermeToken, async (user, error, codeError, msg) => {
           
            await new Promise(r => setTimeout(r, 1000));

            if(error)
            switch (codeError) {
                case 2: 
                case 3:
                    return response(res).error(401, msg)
                case 1:
                case 4:
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