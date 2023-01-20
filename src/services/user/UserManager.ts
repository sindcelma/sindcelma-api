import { Request, Response } from "express";
import { hashPass } from "../../lib/jwt";
import mysqli from "../../lib/mysqli";
import response from "../../lib/response";
import Socio from '../../model/Socio';
import fetch from 'node-fetch'
import Config from "../../lib/config";

class UserManager {


    public static save_token(req:Request, res:Response){
        
        const remembermetk = req.body.remembermetk
        const tokendevice  = req.body.tokendevice

        if(!remembermetk || !tokendevice)
            return response(res).error(400, 'Bad Request')

        const conn = mysqli();

        conn.query(`SELECT id, code FROM user_devices WHERE rememberme = ?`, [remembermetk], (err, result) => {
            
            if(err) return response(res).error(500, 'Server Error')
            if(result[0]['code'] != null && result[0]['code'].trim() != '') 
                return response(res).error(500, 'Not permited')

            conn.query(`UPDATE user_devices SET code = ? WHERE id = ?`, [tokendevice, result[0]['id']], err => {
                if(err) return response(res).error(500, 'Server Error')
                response(res).success()
            })

        })

    }

    public static check_login(req:Request, res:Response){

        const doc = req.body.doc
        
        if(!doc) return response(res).error(400, "Bad Request")

        const cpf  = Socio.transformCpf(req.body.doc)
        const cpfq = cpf ? cpf : ''

        const conn = mysqli();

        conn.query(`
            SELECT 
            socios.cpf,
            socios.np,
            user.email
            FROM socios
            LEFT JOIN user ON user.socio_id = socios.id 
            WHERE user.email = ? OR socios.cpf = ? OR socios.np = ?
        `, [doc, cpfq, doc], (err, result) => {

            if(err) return response(res).error(500, 'Internal Error');

            if(result.length > 0){
                return response(res).success({
                    email: result[0].email ? result[0].email : false,
                    np: result[0].np ? result[0].np : false,
                    cpf: result[0].cpf ? result[0].cpf : false
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
        `, [doc], async (err, result) => {
                       
            if(err) return response(res).error(500, 'Internal Error')
            if(result.length == 0) return response(res).error(404, "Não encontramos um sócio com este documento")

            const socio = result[0];
            const socio_id = socio['id'];

            if(!socio.email){
                
                try {
                   
                    let result = await fetch(`${Config.instance().json().asset}/api/server_file/add_random_fav`, {
                        method:'POST',
                        body:JSON.stringify({
                            pair:Config.instance().getPair(),
                            email:email
                        })
                    })

                    if(result.status != 200)
                        return response(res).error(500, 'Falha ao tentar criar imagem do usuário')


                    conn.query("INSERT INTO user(socio_id, email, senha) VALUES (?,?,?)", [socio_id, email, senha], err => {
                    
                        if(err) return response(res).error(500, 'Erro ao tentar salvar usuário no banco de dados');    
                        response(res).success();
    
                    })
                    
                } catch (error) { 
                    response(res).error(500, 'Erro ao tentar gerar usuário')
                }
                
            } else {
                response(res).error(500, 'Já existe um usuário cadastrado para o sócio');
            }

        })


    }

}

export default UserManager;