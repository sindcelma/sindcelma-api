import { Request, Response } from "express";
import { hashPass } from "../../lib/jwt";
import mysqli from "../../lib/mysqli";
import response from "../../lib/response";
import Socio from '../../model/Socio';

class UserManager {


    public static check_login(req:Request, res:Response){

        const doc = req.body.doc

        if(!doc) return response(res).error(400, "Bad Request")

        const cpf  = Socio.transformCpf(req.body.doc)
        const cpfq = cpf ? cpf : ''

        const conn = mysqli();

        conn.query(`
            SELECT 
            socios.cpf,
            user.email 
            FROM socios
            LEFT JOIN user ON user.socio_id = socios.id 
            WHERE user.email = ? OR socios.cpf = ?
        `, [doc, cpfq], (err, result) => {

            if(err) return response(res).error(500, 'Internal Error');

            if(result.length > 0){
                return response(res).success({
                    email: result[0].email ? result[0].email : false,
                    cpf: result[0].cpf
                })
            }

            return response(res).error(404, "Usuário não encontrado");
        })

    }

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

    public static async create_user(req:Request, res:Response) {
        
        if(!req.body.senha || !req.body.email) return response(res).error(400, 'Bad Request')

        const email = req.body.email;
        const doc   = Socio.transformCpf(req.body.doc);
        const senha = await hashPass(req.body.senha);
        
        const conn = mysqli();
        conn.query(`
            SELECT 
                socios.id,
                socios.cpf,
                user.email 
            FROM socios
            LEFT JOIN user ON user.socio_id = socios.id 
            WHERE
            socios.cpf = ?
        `, [doc], (err, result) => {
                       
            if(err) return response(res).error(500, 'Internal Error')
            if(result.length == 0) return response(res).error(404, "Não encontramos um sócio com este documento")

            const socio = result[0];
            const socio_id = socio['id'];

            if(!socio.email){
                conn.query("INSERT INTO user(socio_id, email, senha) VALUES (?,?,?)", [socio_id, email, senha], err => {
                    if(err) return response(res).error(500, 'Erro ao tentar gerar usuário');
                    response(res).success();
                })
            } else {
                response(res).error(500, 'Já existe um usuário cadastrado');
            }

        })


    }

}

export default UserManager;