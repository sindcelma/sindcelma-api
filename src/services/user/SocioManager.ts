import { Request, Response } from "express";
import assertion from "../../lib/assertion";
import mysqli from "../../lib/mysqli";
import response from "../../lib/response";
import { createHmac } from "crypto";
import Config from "../../lib/config";

class SocioManager {


    /**
     * testado: false
     */
    public static get_socio_by_login(req:Request, res:Response){

        //   verificar se houve confirmação através de código
        //   - se houver confirmação solicitar senha 
        //   - se não houver solicitar confirmação

        let email = req.body.email 
        let doc = req.body.doc 
        
        if(!email || !doc){
            return response(res).error(400, 'Bad Request')
        }
        
        const conn = mysqli()
        
        if(doc) {
            conn.query(
                `SELECT 
                    user.id,
                    user.email,
                    socios.cpf,
                    socios.status
                FROM socios 
                LEFT JOIN user ON socios.user_id = user.id 
                WHERE
                    socios.cpf = ?`, 
            [doc], (err, result) => {
                
                if(err) return response(res).error(500, 'Interal Error')
                if(result.length == 0) return response(res).error(404, 'Not Found')
                
                let data:any = result[0]
                if(data.status == 2) return response(res).error(401, 'Unauthorized')
                
                if(data.id == null) return response(res).success({ action:'user' })
                
                return response(res).success({
                    action:'pass',
                    email:data.email,
                    cpf:data.cpf
                })
            })
        } else {

            conn.query(
                `SELECT 
                    user.id,
                    user.email,
                    socios.cpf,
                    socios.status
                FROM user 
                JOIN socios ON socios.user_id = user.id 
                WHERE 
                    user.email = ?`, 
            [email], (err, result) => {
                
                if(err) return response(res).error(500, 'Interal Error')
                if(result.length == 0) return response(res).error(404, 'Not Found')

                let data:any = result[0]

                conn.end()

                return response(res).success({
                    action:'pass',
                    email:data.email,
                    cpf:data.cpf
                })
            })
        }

    }

    /**
     * testado: false
     */
    public static cadastrar_usuario(req:Request, res:Response){
        // verificar se o cliente enviou o CPF, email, senha
        let email = req.body.email 
        let doc = req.body.cpf 
        let senha = req.body.senha 
        let news = req.body.news
        
        if(!email || !doc || !senha){
            return response(res).error(400, 'Bad Request')
        }
        
        const conn = mysqli()

        conn.query(`
            INSERT INTO user (email, senha, ativo) VALUES (?,?,1)
        `, [email, senha], (err, result) => {

            if(err) return response(res).error(500, 'Interal Error')

            const user_id = result.insertId

            conn.query(`
                UPDATE FROM socios SET user_id = ? WHERE cpf = ?
            `, [user_id, doc], (err2, result2) => {

                if(err2) return response(res).error(500, 'Critical Error')

                if(news){
                    conn.query(`
                        INSERT INTO mailing_socio (user_id, ativo) VALUES (?,1)
                    `, [user_id], () => conn.end())
                } else {
                    conn.end()
                }

            })

        })

    }

    /**
     * testado: false
     */
    public static update_usuario(req:Request, res:Response){
        // alterar email
    }

    /**
     * testado: false
     */
    public static confirmar_cadastro(req:Request, res:Response){
        // verificar se o cliente enviou o CPF, email com o código de confirmação
    }

    /**
     * testado: false
     */
    public static recuperar_login(req:Request, res:Response){
        // gerar o código e enviar via email ou telefone
    }

    /**
     * testado: false
     */
    public static checar_codigo_login(req:Request, res:Response){
        // verificar o codigo
    }

    /**
     * testado: false
     */
    public static cadastrar_socio(req:Request, res:Response){
        // Nome, sobrenome, CPF
    }

    /**
     * testado: false
     */
    public static add_dados_profissionais(req:Request, res:Response){
        // cargo, empresa, etc...
        // verificar se o user é admin
        // verificar se o user é um sócio, se for um sócio verificar se o id é o mesmo
        // que o do usuário que será registrado
        // socio slug 
    }

    /**
     * testado: false
     */
    public static add_dados_pessoais(req:Request, res:Response){
        // verificar se o user é admin
        // verificar se o user é um sócio, se for um sócio verificar se o id é o mesmo
        // que o do usuário que será registrado
        // socio slug 
    }

    /**
     * testado: false
     */
    public static list(req:Request, res:Response){
        
        try {
            assertion(res)
            .isAdmin(req.user)
            .assert()
        } catch (error) {
            return false
        }

        response(res).success()
    }

    /**
     * testado: false
     */
    public static aprove(req:Request, res:Response){
        try {
            assertion(res)
            .isAdmin(req.user)
            .assert()
        } catch (error) {
            return false
        }

        response(res).success()
    }

    /**
     * testado: false
     */
    public static update_dados_socio(req:Request, res:Response){
        // nao pode alterar cpf
    }

    /**
     * testado: false
     */
    public static update_dados_profissionais(req:Request, res:Response){

    }

    /**
     * testado: false
     */
    public static update_dados_pessoais(req:Request, res:Response){

    }

}

export default SocioManager