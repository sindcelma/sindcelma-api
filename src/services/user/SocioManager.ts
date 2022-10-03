import { Request, Response } from "express";
import assertion from "../../lib/assertion";
import mysqli from "../../lib/mysqli";
import response from "../../lib/response";
import { createHmac } from "crypto";
import Config from "../../lib/config";

class SocioManager {

    public static add_dados_profissionais(req:Request, res:Response){

        // empresa id
        const empresaID = req.body.empresaID 
        // dados profissionais
        const cargo = req.body.cargo
        const admis = req.body.data_admissao
        const matrc = req.body.num_matricula
        const tipo  = req.body.tipo

        const conn = mysqli()
        /*
        conn.query("INSERT INTO user (nome, sobrenome, email, senha, ativo) VALUES (?,?,?,?,?)", 
                [nome, sobr, email, senha, 0], (err, result) => {

                    
        })
        */
    }


    public static add_dados_pessoais(req:Request, res:Response){

        const socio_id = req.body.socio_id

        // dados pessoais
        const nasc  = req.body.data_nascimento
        const civil = req.body.estado_civil
        const cpf   = req.body.cpf
        const rg    = req.body.rg
        const sexo  = req.body.sexo
        
        const conn = mysqli()
        /*
        conn.query("INSERT INTO socios_dados_pessoais (socio_id, rg, cpf, sexo, estado_civil, data_nascimento) VALUES (?,?,?,?,?,?)",
            [ sid, rg, cpf, sexo, civil, nasc ], (err) => {
                if(err) {
                    conn.end()
                    return response(res).error(500, "Internal error.")
                }
                response(res).success("Sócio temporário foi criado com sucesso.")
                conn.end()
            }
        )
        */
    }

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
     * Adicionar sócio
     * coloca-lo pra aprovação
     */
    public static add(req:Request, res:Response){
        
        // dados socio
        const email = req.body.email 
        const senha = req.body.senha // criptografar
        const nome  = req.body.nome // criptografar
        const sobr  = req.body.sobrenome
    
       

        /*
        // empresa id
        const empresaID = req.body.empresaID 
        // dados profissionais
        const cargo = req.body.cargo
        const admis = req.body.data_admissao
        const matrc = req.body.num_matricula
        const tipo  = req.body.tipo
        */
        const conn = mysqli()
        
        try { 
            conn.query("INSERT INTO user (nome, sobrenome, email, senha, ativo) VALUES (?,?,?,?,?)", 
                [nome, sobr, email, senha, 0], (err, result) => {
                
                    if(err) {
                        conn.end()
                        return response(res).error(401, "Este e-mail já está cadastrado.")
                    }
                    
                    const uid = result.insertId
                    
                    const slug = createHmac('sha256', Config.instance().json().salt)
                    .update(`user_id_${uid + email}`)
                    .digest('hex');

                    conn.query("INSERT INTO socios (user_id, slug, status) VALUES (?,?,?)", 
                        [uid, slug, 0], (err, result2) => {
                        
                            if(err) {
                                conn.end()
                                return response(res).error(500, "Internal error.")
                            }

                            conn.end()
                        }
                    )
                    
                }
            )
        } catch (error) {
            conn.end()
            return response(res).error(500, "Internal Error")
        }

    }

    /**
     * Aprovar sócio
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
     * Editar dados sócio
     */
    public static update(req:Request, res:Response){

    }

}

export default SocioManager