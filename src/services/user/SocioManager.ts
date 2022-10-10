import { Request, Response } from "express";
import assertion from "../../lib/assertion";
import { generateSlug } from "../../lib/jwt";
import mysqli from "../../lib/mysqli";
import response from "../../lib/response";

class SocioManager {


    /**
     * testado: false
     */
    public static get_socio_by_login(req:Request, res:Response){

        //   verificar se houve confirmação através de código
        //   - se houver confirmação solicitar senha 
        //   - se não houver solicitar confirmação

        let email = req.body.email 
        let doc   = req.body.doc 
        
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
                
                conn.end()
                
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
                
                conn.end()
                
                if(err) return response(res).error(500, 'Interal Error')
                if(result.length == 0) return response(res).error(404, 'Not Found')

                let data:any = result[0]

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

            if(err) {
                conn.end() 
                return response(res).error(500, 'Internal Error')
            }

            const user_id = result.insertId

            conn.query(`
                UPDATE FROM socios SET user_id = ? WHERE cpf = ?
            `, [user_id, doc], (err2, result2) => {

                if(err2) {
                    conn.end() 
                    return response(res).error(500, 'Critical Error')
                }

                if(news){
                    conn.query(`
                        INSERT INTO mailing_socio (user_id, ativo) VALUES (?,1)
                    `, [user_id], () => conn.end())
                } else {
                    conn.end()
                }

                response(res).success()

            })

        })

    }

    /**
     * testado: false
     */
    public static update_usuario(req:Request, res:Response){
        // alterar email

        let slug  = req.body.slug 
        let email = req.body.email

        let user  = req.user 
        
        try {
            assertion()
            .isAdmin(user)
            .orIsSameSocio(user, slug)
            .assert()
        } catch (error) {
            response(res).error(401, 'Unauthorized')
        }

        const conn = mysqli()
        
        conn.query(`
            SELECT user.id 
            FROM user JOIN socios ON socios.user_id = user.id 
            WHERE socios.slug = ?
        `, [slug], (err1, result) => {
            
            if(err1) {
                conn.end()
                return response(res).error(404, 'Not Found')
            }
            
            conn.query("UPDATE user SET email = ? WHERE id = ?", [email, result[0].id], err2 => {
                conn.end()
                if(err2){
                    return response(res).error(500, 'Internal Error')
                }
                response(res).success()
            })

        })

    }


    public static cadastrar_socio(req:Request, res:Response){
        // Nome, sobrenome, CPF
        const nome = req.body.nome 
        const sobrenome = req.body.sobrenome 
        const cpf = req.body.cpf

        const conn = mysqli()
        
        const slug = generateSlug(cpf + String(new Date().getMilliseconds())+String(Math.random()))
        const salt = generateSlug(slug+ String(new Date().getMilliseconds())+String(Math.random()))

        conn.query(`
            INSERT INTO socios (nome, sobrenome, cpf, slug, salt, status)
            VALUES (?,?,?,?,?,0)
        `,[nome, sobrenome, cpf, slug, salt], err => {
            conn.end()
            if(err) {
                return response(res).error(500, "Já existe um sócio cadastrado com este documento")
            }
            response(res).success({
                slug:slug
            })
        })
    
    }

    /**
     * testado: false
     */
    public static add_dados_profissionais(req:Request, res:Response){

        const slug = req.body.slug
        const empresa_id = req.body.empresa_id
        const cargo = req.body.cargo
        const data_admissao = req.body.data_admissao
        const num_matricula = req.body.num_matricula

        try {
            assertion()
            .isAdmin(req.user)
            .isSameSocio(req.user, slug)
            .assert()
        } catch (error) {
            return response(res).error(401, 'Unauthorized')
        }

        const conn = mysqli()

        conn.query(`
            SELECT socios.id 
            FROM socios 
            WHERE slug = ?
        `, [slug], (err1, result) => {

            if(err1){
                conn.end()
                return response(res).error(500, 'Internal Error')
            }

            if(result.length == 0){
                conn.end()
                return response(res).error(404, 'Not Found')
            }

            const socio_id = result[0].id

            conn.query(`
                INSERT INTO socios_dados_profissionais
                (empresa_id, socio_id, cargo, data_admissao, num_matricula)
                VALUES (?,?,?,?,?)
            `,[empresa_id, socio_id, cargo, data_admissao, num_matricula], err2 => {
                conn.end()
                if(err2){
                    return response(res).error(500, 'Internal Error')
                }
                response(res).success()
            })
        })
        

    }

    /**
     * testado: false
     */
    public static add_dados_pessoais(req:Request, res:Response){
        
        const slug = req.body.slug
        const rg = req.body.rg
        const sexo = req.body.sexo
        const estado_civil = req.body.estado_civil
        const data_nascimento = req.body.data_nascimento
        const telefone = req.body.telefone

        try {
            assertion()
            .isAdmin(req.user)
            .isSameSocio(req.user, req.body.slug)
            .assert()
        } catch (error) {
            return response(res).error(401, 'Unauthorized')
        }

        const conn = mysqli()

        conn.query(`
            SELECT socios.id 
            FROM socios 
            WHERE slug = ?
        `, [slug], (err1, result) => {

            if(err1){
                conn.end()
                return response(res).error(500, 'Internal Error')
            }

            if(result.length == 0){
                conn.end()
                return response(res).error(404, 'Not Found')
            }

            const socio_id = result[0].id

            conn.query(`
                INSERT INTO socios_dados_pessoais
                (socio_id, rg, sexo, estado_civil, data_nascimento, telefone)
                VALUES (?,?,?,?,?,?)
            `,[socio_id, rg, sexo, estado_civil, data_nascimento, telefone], err2 => {
                conn.end()
                if(err2){
                    return response(res).error(500, 'Internal Error')
                }
                response(res).success()
            })
        })
    }

    /**
     * testado: false
     */
    public static list(req:Request, res:Response){
        
        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch (error) {
            return response(res).error(401, 'Unauthorized')
        }

        response(res).success()
    }

    /**
     * testado: false
     */
    public static aprove(req:Request, res:Response){
        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch (error) {
            return response(res).error(401, 'Unauthorized')
        }

        const conn = mysqli()
        conn.query(`
            UPDATE socios SET status = 1 WHERE slug = ?
        `, [req.body.slug], err => {
            conn.end()
            if(err) {
                return response(res).error(500, 'Internal Error')
            }
            response(res).success()
        })
        
    }

    /**
     * testado: false
     */
    public static update_dados_socio(req:Request, res:Response){
        // nao pode alterar cpf
        const nome = req.body.nome 
        const sobrenome = req.body.sobrenome 
        const slug = req.body.slug 
        
        try {
            assertion()
            .isAdmin(req.user)
            .isSameSocio(req.user, req.body.slug)
            .assert()
        } catch (error) {
            return response(res).error(401, 'Unauthorized')
        }

        const conn = mysqli()
        conn.query(`
            UPDATE socios SET nome = ? , sobrenome = ? WHERE slug = ?
        `, [nome, sobrenome, slug], err => {
            conn.end()
            if(err) {
                return response(res).error(500, 'Internal Error')
            }
            response(res).success()
        })

    }

    /**
     * testado: false
     */
    public static update_dados_profissionais(req:Request, res:Response){

        const slug = req.body.slug
        const empresa_id = req.body.empresa_id
        const cargo = req.body.cargo
        const data_admissao = req.body.data_admissao
        const num_matricula = req.body.num_matricula

        try {
            assertion()
            .isAdmin(req.user)
            .isSameSocio(req.user, req.body.slug)
            .assert()
        } catch (error) {
            return response(res).error(401, 'Unauthorized')
        }

        const conn = mysqli()

        conn.query(`
            SELECT socios_dados_profissionais.id 
            FROM   socios_dados_profissionais
            JOIN   socios ON socios.id = socios_dados_profissionais.socio_id
            WHERE  socios.slug = ?
        `, [slug], (err, result) => {
            
            if(err) {
                conn.end()
                return response(res).error(500, 'Internal Error')
            }

            if(result.length == 0){
                conn.end()
                return response(res).error(404, 'Not Found')
            }

            const id = result[0].id

            conn.query(`
                UPDATE socios_dados_profissionais 
                SET    empresa_id = ?
                ,      cargo = ? 
                ,      data_admissao = ? 
                ,      num_matricula = ?
                WHERE  id = ?
            `, [empresa_id, cargo, data_admissao, num_matricula, id], err2 => {
                conn.end()
                if(err2) {
                    return response(res).error(500, 'Internal Error')
                }
                response(res).success()
            })

        })
    }

    /**
     * testado: false
     */
    public static update_dados_pessoais(req:Request, res:Response){
        
        const slug = req.body.slug
        const rg = req.body.rg
        const sexo = req.body.sexo
        const estado_civil = req.body.estado_civil
        const data_nascimento = req.body.data_nascimento
        const telefone = req.body.telefone
        
        try {
            assertion()
            .isAdmin(req.user)
            .isSameSocio(req.user, req.body.slug)
            .assert()
        } catch (error) {
            return response(res).error(401, 'Unauthorized')
        }

        const conn = mysqli()

        conn.query(`
            SELECT socios_dados_pessoais.id 
            FROM   socios_dados_pessoais
            JOIN   socios ON socios.id = socios_dados_pessoais.socio_id
            WHERE  socios.slug = ?
        `, [slug], (err, result) => {
            
            if(err) {
                conn.end()
                return response(res).error(500, 'Internal Error')
            }

            if(result.length == 0){
                conn.end()
                return response(res).error(404, 'Not Found')
            }

            const id = result[0].id

            conn.query(`
                UPDATE socios_dados_pessoais 
                SET    socio_id = ?
                ,      rg = ? 
                ,      sexo = ? 
                ,      estado_civil = ?
                ,      data_nascimento = ?
                ,      telefone = ?
                WHERE  id = ?
            `, [rg, sexo, estado_civil, data_nascimento, telefone, id], err2 => {
                conn.end()
                if(err2) {
                    return response(res).error(500, 'Internal Error')
                }
                response(res).success()
            })

        })
        
    }

}

export default SocioManager