import { Request, Response } from "express";
import assertion from "../../lib/assertion";
import { generateSlug, hashPass } from "../../lib/jwt";
import mysqli from "../../lib/mysqli";
import response from "../../lib/response";
import Socio from "../../model/Socio";
import crypto from 'crypto'

import { renameSync } from 'fs';
import { join } from 'path';

class SocioManager {


    public static update_doc_by_np(req:Request, res:Response){
        
        const np  = req.body.np
        const cpf = Socio.transformCpf(req.body.cpf)

        if(!np || !cpf) return response(res).error(400, 'bad request');

        const conn = mysqli();
        conn.query(`
            SELECT 
                  cpf
            FROM  socios 
            WHERE np = ?
        `, [np], (err, result) => {

            if(err) {
                return response(res).error(500, "Este CPF já está cadastrado com outro usuário.")
            }

            if(result.length == 0){
                return response(res).error(404, 'Not Found')
            }

            if(result[0].cpf != null){
                return response(res).error(403, 'Seu CPF já está cadastrado')
            }

            conn.query("UPDATE socios SET cpf = ? WHERE np = ?", [cpf, np], err => {
                if(err) return response(res).error(500, err)
                response(res).success()
            })

        });

    }

    public static get_dados_profissionais(req:Request, res:Response){

        const slug = req.body.slug
        const empresa_id = req.body.empresa_id
        
        if(!slug || !empresa_id) return response(res).error(400, 'bad request');

        var assert = assertion();

        try {
            assert = 
            assertion()
            .isAdmin(req.user)
            .orIsSameSocio(req.user, req.body.slug)
            .assert()
        } catch (error) {
            return response(res).error(401, 'Unauthorized')
        }


        const conn = mysqli();
        conn.query(`
            SELECT 
                empresas.nome as nome_empresa,
                socios_dados_profissionais.cargo,
                socios_dados_profissionais.data_admissao,
                socios_dados_profissionais.num_matricula,
                user.temp_key
            FROM
                socios_dados_profissionais
            JOIN socios ON socios_dados_profissionais.socio_id = socios.id 
            JOIN user ON user.socio_id = socios.id
            JOIN empresas ON socios_dados_profissionais.empresa_id = empresas.id 
            WHERE socios.slug = ? AND socios_dados_profissionais.empresa_id = ?
        `, [slug, empresa_id], (err1, result) => {

            if(err1) {
                return response(res).error(500, err1)
            }

            if(result.length == 0){
                return response(res).error(404, 'Not Found')
            }

            if(!req.body.key){
                return response(res).error(400, 'bad request')
            }
            
            if(assert.index != 0 && req.body.key != result[0].temp_key){
                return response(res).error(403, 'need refresh key')
            }

            response(res).success(result[0])

        })

    }

    public static get_dados_pessoais(req:Request, res:Response){
        
        const slug = req.body.slug
        
        if(!slug) return response(res).error(400, 'bad request');

        var assert = assertion();

        try {
            assert = 
            assertion()
            .isAdmin(req.user)
            .orIsSameSocio(req.user, req.body.slug)
            .assert()
        } catch (error) {
            return response(res).error(401, 'Unauthorized')
        }

        const conn = mysqli();
        conn.query(`
            SELECT
                 socios.cpf,
                 socios_dados_pessoais.rg,
                 socios_dados_pessoais.sexo,
                 socios_dados_pessoais.data_nascimento,
                 socios_dados_pessoais.telefone,
                 socios_dados_pessoais.estado_civil,
                 user.temp_key
            FROM socios 
            JOIN user ON user.socio_id = socios.id 
            LEFT JOIN socios_dados_pessoais ON socios.id = socios_dados_pessoais.socio_id
            WHERE socios.slug = ?
        `, [slug], (err1, result) => {

            if(err1) {
                return response(res).error(500, err1)
            }

            if(result.length == 0){
                return response(res).error(404, 'Not Found')
            }

            if(!req.body.key){
                return response(res).error(400, 'bad request')
            }
            
            if(assert.index != 0 && req.body.key != result[0].temp_key){
                return response(res).error(403, 'need refresh key')
            }

            response(res).success(result[0])
            
        })

    }


    public static update_dados_socio(req:Request, res:Response){
        // nao pode alterar cpf
        const nome      = req.body.nome 
        const sobrenome = req.body.sobrenome 
        const slug      = req.body.slug 
        
        var assert = assertion();

        try {
            assert = 
            assertion()
            .isAdmin(req.user)
            .orIsSameSocio(req.user, req.body.slug)
            .assert()
        } catch (error) {
            return response(res).error(401, 'Unauthorized')
        }

        const conn = mysqli()

        conn.query(`
            SELECT user.id, user.temp_key
            FROM   user JOIN socios ON user.socio_id = socios.id 
            WHERE  socios.slug = ?
        `, [slug], (err1, result) => {

            if(err1) {
                return response(res).error(500, err1)
            }

            if(result.length == 0){
                return response(res).error(404, 'Not Found')
            }

            if(!req.body.key){
                return response(res).error(400, 'bad request')
            }
            
            if(assert.index != 0 && req.body.key != result[0].temp_key){
                return response(res).error(403, 'need refresh key')
            }

            conn.query(`
                UPDATE socios SET nome = ? , sobrenome = ? WHERE slug = ?
            `, [nome, sobrenome, slug], err => {
                if(err) {
                    return response(res).error(500, 'Internal Error')
                }
                response(res).success()
            })

        })

    }


    public static update_dados_profissionais(req:Request, res:Response){

        const slug = req.body.slug
        const empresa_id = req.body.empresa_id
        const cargo = req.body.cargo
        const data_admissao = req.body.data_admissao
        const num_matricula = req.body.num_matricula

        var assert = assertion();

        try {
            assert = 
            assertion()
            .isAdmin(req.user)
            .orIsSameSocio(req.user, req.body.slug)
            .assert()
        } catch (error) {
            return response(res).error(401, 'Unauthorized')
        }

        const conn = mysqli()

        conn.query(`
            SELECT 
                   socios_dados_profissionais.id,
                   user.temp_key
             FROM  socios_dados_profissionais
             JOIN  socios ON socios.id = socios_dados_profissionais.socio_id
             JOIN  user ON user.socio_id = socios.id 
            WHERE  socios.slug = ?
        `, [slug], (err1, result) => {
            
            if(err1) {
                return response(res).error(500, err1)
            }

            if(result.length == 0){
                return response(res).error(404, 'Not Found')
            }

            if(!req.body.key){
                return response(res).error(400, 'bad request')
            }
            
            if(assert.index != 0 && req.body.key != result[0].temp_key){
                return response(res).error(403, 'need refresh key')
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
                if(err2) {
                    return response(res).error(500, 'Internal Error')
                }
                response(res).success()
            })

        })

    }

    /**
     * TESTADO
     */
    public static update_dados_pessoais(req:Request, res:Response){
        
        const slug = req.body.slug
        const rg = req.body.rg
        const sexo = req.body.sexo
        const estado_civil = req.body.estado_civil
        const data_nascimento = req.body.data_nascimento
        const telefone = req.body.telefone
        
        var assert = assertion();

        try {
            assert = 
            assertion()
            .isAdmin(req.user)
            .orIsSameSocio(req.user, req.body.slug)
            .assert()
        } catch (error) {
            return response(res).error(401, 'Unauthorized')
        }

        const conn = mysqli()

        conn.query(`
            SELECT 
                   socios_dados_pessoais.id ,
                   user.temp_key
            FROM   socios_dados_pessoais
            JOIN   socios ON socios.id = socios_dados_pessoais.socio_id
            JOIN   user ON user.socio_id = socios.id
            WHERE  socios.slug = ?
        `, [slug], (err1, result) => {
            
            if(err1) {
                return response(res).error(500, err1)
            }

            if(result.length == 0){
                return response(res).error(404, 'Not Found')
            }

            if(!req.body.key){
                return response(res).error(400, 'bad request')
            }
            
            if(assert.index != 0 && req.body.key != result[0].temp_key){
                return response(res).error(403, 'need refresh key')
            }

            const id = result[0].id

            conn.query(`
                UPDATE socios_dados_pessoais 
                SET    rg = ? 
                ,      sexo = ? 
                ,      estado_civil = ?
                ,      data_nascimento = ?
                ,      telefone = ?
                WHERE  id = ?
            `, [rg, sexo, estado_civil, data_nascimento, telefone, id], err2 => {
                if(err2) {
                    return response(res).error(500, err2)
                }
                response(res).success()
            })

        })

    }

    /**
     * TESTADO
     */
    public static update_email(req:Request, res:Response){
        // alterar email

        let slug  = req.body.slug 
        let email = req.body.email

        if(!slug || !email){
            return response(res).error(400, 'bad request')
        }

        let user  = req.user 

        var assert = assertion();

        try {
            assert = 
            assertion()
            .isAdmin(user)
            .orIsSameSocio(user, slug)
            .assert()
        } catch (error) {
            return response(res).error(401, 'Unauthorized')
        }

        const conn = mysqli()
        
        conn.query(`
            SELECT user.id, user.temp_key, user.email
            FROM   user JOIN socios ON user.socio_id = socios.id 
            WHERE  socios.slug = ?
        `, [slug], (err1, result) => {
            
            if(err1) {
                return response(res).error(500, err1)
            }

            if(result.length == 0){
                return response(res).error(404, 'Not Found')
            }

            if(!req.body.key){
                return response(res).error(400, 'bad request')
            }
            
            if(assert.index != 0 && req.body.key != result[0].temp_key){
                return response(res).error(403, 'need refresh key')
            }
            
            conn.query("UPDATE user SET email = ? WHERE id = ?", [email, result[0].id], err2 => {
                if(err2){
                    return response(res).error(500, 'Este email já está cadastrado')
                }

                try {
                    const newF    = `../../public/images/fav/${email}.jpg`
                    const oldF    = `../../public/images/fav/${result[0].email}.jpg`
                
                    const fileN   = join(__dirname, newF)
                    const fileO   = join(__dirname, oldF)
                    
                    renameSync(fileO, fileN)
                    
                } catch (error) {
                    console.log(error);
                }

                conn.query("DELETE FROM user_devices WHERE user_id = ?", [result[0].id])
                conn.query("UPDATE user SET version = version+1 WHERE id = ?", [result[0].id])
                response(res).success()
            })

        })

    }

    public static async verify_by_qrcode_token(req:Request, res:Response) {

        if(!req.params.token) return response(res).error(400, 'bad request')
        
        const fulltoken  = req.params.token
        
        const partstoken = fulltoken.split('.')
        const datasender = Buffer.from(partstoken[0], 'base64').toString('utf-8')
        const strhash256 = partstoken[1]

        try {

            const objDataUser:{slug:String, duration:Number} = JSON.parse(datasender);
            
            if(Date.now() > objDataUser.duration){
                return response(res).error(403, 'Forbiden - Link Expired')
            }

            const conn = mysqli()
            
            conn.query("SELECT salt, nome, sobrenome FROM socios WHERE slug = ?", [objDataUser.slug], async (err, result) => {

                if(err) return response(res).error(500, 'internal error')
                if(result.length == 0) return response(res).error()
                
                const socio:{salt:string, nome:string, sobrenome:string} = result[0]; 
                const salt  = socio.salt;
                const key   = objDataUser.slug+salt+datasender;

                const utf8 = new TextEncoder().encode(key);
                const hashBuffer = crypto.createHash('sha256').update(utf8).digest('hex');
                
                if(hashBuffer != strhash256) {
                    return response(res).error(401, 'Unauthorized')
                }
  
                response(res).html('socio_view', {
                    nome: socio.nome+" "+socio.sobrenome
                })
                
            })
            

        } catch (error) {
            return response(res).error(403, 'Forbiden - Bad Link')
        }
    
    }

    public static async check_status(req:Request, res:Response){

        const conn = mysqli();

        conn.query(`
            SELECT 
                  socios.id,
                  socios.status
            FROM  socios
            JOIN  user ON user.socio_id 
            WHERE user.id = ?
        `,[req.user.getId()], (err, result) => {
            
            if(err) return response(res).error(500, 'Internal Error 1')
            if(result.length == 0) return response(res).error()
            
            if(result[0].status == 1){

                const socio_id = result[0].id;
                conn.query(`
                    SELECT 
                          id
                    FROM  user_images
                    WHERE type = ?
                `, ['doc'], (err, result) => {

                    if(err) return response(res).error(500, 'Internal Error 2');
                    if(result.length == 0) return response(res).error(401);

                    conn.query("UPDATE socios SET status = 2 WHERE id = ? ", [socio_id], err => {
                        if(err) return response(res).error(500, 'Internal Error 3'); 
                        response(res).success()
                    })
                })
            } else {   
                response(res).success()
            }

        })

    }
    
    public static async cadastrar_full_socio(req:Request, res:Response){

        const empresa_id = 1
        const nome       = req.body.nome 
        const sobrenome  = req.body.sobrenome 
        const cpf        = Socio.transformCpf(req.body.cpf);
        const email      = req.body.email 
        const senha      = await hashPass(req.body.senha)
        const rg         = req.body.rg
        const sexo       = req.body.sexo[0]
        const civil      = req.body.estado_civil
        const nascimento = req.body.data_nascimento
        const telefone   = req.body.telefone
        const cargo      = req.body.cargo
        const admissao   = req.body.data_admissao

        if(!email || !cpf || !senha || !nome || !sobrenome || !rg || !sexo 
            || !civil || !nascimento || !telefone || !cargo || !admissao){
            return response(res).error(400, 'Bad Request 1')
        }

        const conn = mysqli()
        
        const slug = generateSlug(cpf + String(new Date().getMilliseconds())+String(Math.random()))
        const salt = generateSlug(slug+ String(new Date().getMilliseconds())+String(Math.random()))

        conn.query(`
            INSERT INTO socios (nome, sobrenome, cpf, slug, salt, status)
            VALUES (?,?,?,?,?,0)
        `,[nome, sobrenome, cpf, slug, salt], (err, result) => {
            
            if(err) {
                return response(res).error(500, "Já existe um sócio cadastrado com este documento")
            }

            const socio_id = result.insertId

            conn.query(`
                INSERT INTO user (email, senha, socio_id) VALUES (?,?,?)
            `, [email, senha, socio_id], (err, result2) => {
                
                const user_id = result2.insertId

                if(err) {
                    return response(res).error(500, 'Este e-mail já está cadastrado')
                }
                
                conn.query(`
                    INSERT INTO socios_dados_profissionais
                    (empresa_id, socio_id, cargo, data_admissao, num_matricula)
                    VALUES (?,?,?,?,?)
                `,[empresa_id, socio_id, cargo, admissao, ''])

                conn.query(`
                    INSERT INTO socios_dados_pessoais
                    (socio_id, rg, sexo, estado_civil, data_nascimento, telefone)
                    VALUES (?,?,?,?,?,?)
                `,[socio_id, rg, sexo, civil, nascimento, telefone], err2 => {
                    if(err2){
                        return response(res).error(500, err2.message)
                    }
                    
                    conn.query("UPDATE socios SET status = 1 WHERE id = ?", [socio_id], 
                        (err4)=> {

                            if(err4){
                                return response(res).error(500, err4.message)
                            }
                            
                            response(res).success({
                                cpf:cpf,
                                slug:slug,
                                salt:salt
                            })

                        } 
                    )
                    
                })

            })

        })
    
    }

    public static check_document(req:Request, res:Response){
        
        const conn = mysqli()
        let doc    = req.body.doc

        if(!doc){
            return response(res).error(400, 'Bad Request')
        }

        const cpf = Socio.transformCpf(doc);

        conn.query(
            `SELECT 
                status,
                id
            FROM socios 
            WHERE
                cpf = ? `, 
        [cpf], (err, result) => {
            
            if(err) return response(res).error(500, 'Interal Error')
            
            if(result.length == 0) {
                return response(res).success()
            }
            
            let data:any = result[0]

            if(data.status > 0){
                return response(res).error(401, 'Unauthorized')
            } else {
                conn.query("DELETE FROM socios WHERE id = ?", [data.id], () => {})
                return response(res).success()
            }
            
        })
        
    }

    public static get_socio_by_login(req:Request, res:Response){

        let email = req.body.email 
        let doc   = Socio.transformCpf(req.body.doc);
        
        if(!email && !doc){
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
                if(data.status == 2) return response(res).error(401, 'Unauthorized')

                return response(res).success({
                    action:'pass',
                    email:data.email,
                    cpf:data.cpf
                })

            })

        }

    }

    public static cadastrar_usuario(req:Request, res:Response){
        // verificar se o cliente enviou o CPF, email, senha
        let email = req.body.email 
        let doc   = Socio.transformCpf(req.body.doc); 
        let senha = req.body.senha 
        let news  = req.body.news
        
        if(!email || !doc || !senha){
            return response(res).error(400, 'Bad Request')
        }
        
        const conn = mysqli()

        conn.query(`
            INSERT INTO user (email, senha, ativo) VALUES (?,?,1)
        `, [email, senha], (err, result) => {

            if(err) {
                return response(res).error(500, 'Este e-mail já está cadastrado')
            }

            const user_id = result.insertId

            conn.query(`
                UPDATE socios SET user_id = ? WHERE cpf = ?
            `, [user_id, doc], err2 => {

                if(err2) {
                    return response(res).error(500, 'Erro Crítico - contate o admin')
                }

                if(news){
                    conn.query(`
                        INSERT INTO mailing_socio (user_id, ativo) VALUES (?,1)
                    `, [user_id], () => {})
                } else {
                }

                response(res).success()

            })

        })

    }

    public static delete_usuario(req:Request, res:Response){

        let user_id = req.body.user_id
        let user  = req.user 

        try {
            assertion()
            .isAdmin(user)
            .assert()
        } catch (error) {
            return response(res).error(401, 'Unauthorized')
        }

        const conn = mysqli()

        conn.query("DELETE FROM user WHERE id = ?", [user_id], err => {
            if(err){
                return response(res).error(500, 'Server Error')
            }
            response(res).success()
        })

    }

    public static cadastrar_socio(req:Request, res:Response){
        // Nome, sobrenome, CPF
        const nome = req.body.nome 
        const sobrenome = req.body.sobrenome 
        const cpf = Socio.transformCpf(req.body.cpf);

        const conn = mysqli()
        
        const slug = generateSlug(cpf + String(new Date().getMilliseconds())+String(Math.random()))
        const salt = generateSlug(slug+ String(new Date().getMilliseconds())+String(Math.random()))

        conn.query(`
            INSERT INTO socios (nome, sobrenome, cpf, slug, salt, status)
            VALUES (?,?,?,?,?,0)
        `,[nome, sobrenome, cpf, slug, salt], err => {
            if(err) {
                return response(res).error(500, "Já existe um sócio cadastrado com este documento")
            }
            response(res).success({
                slug:slug
            })
        })
    
    }

    public static add_dados_profissionais(req:Request, res:Response){


        //const empresa_id = req.body.empresa_id
        const empresa_id = 1

        const slug      = req.body.slug
        const cargo     = req.body.cargo
        const admissao  = req.body.data_admissao
        //const matricula = req.body.num_matricula

        const conn = mysqli()

        conn.query(`
            SELECT socios.id 
            FROM socios 
            WHERE slug = ?
            AND status = 0
        `, [slug], (err1, result) => {

            if(err1){
                return response(res).error(500, 'Internal Error')
            }

            if(result.length == 0){
                return response(res).error(404, 'Not Found')
            }

            const socio_id = result[0].id

            conn.query(`
                INSERT INTO socios_dados_profissionais
                (empresa_id, socio_id, cargo, data_admissao, num_matricula)
                VALUES (?,?,?,?,?)
            `,[empresa_id, socio_id, cargo, admissao, ''], err2 => {
                if(err2){
                    return response(res).error(501, 'Já existem dados profissionais cadastrados neste socio')
                }
                response(res).success()
            })
        })
        

    }

    public static add_dados_pessoais(req:Request, res:Response){
        
        const slug = req.body.slug
        const rg = req.body.rg
        const sexo = req.body.sexo
        const estado_civil = req.body.estado_civil
        const data_nascimento = req.body.data_nascimento
        const telefone = req.body.telefone

        const conn = mysqli()

        conn.query(`
            SELECT socios.id 
            FROM socios 
            WHERE slug = ?
            AND status = 0
        `, [slug], (err1, result) => {

            if(err1){
                return response(res).error(500, 'Internal Error')
            }

            if(result.length == 0){
                return response(res).error(404, 'Not Found')
            }

            const socio_id = result[0].id

            conn.query(`
                INSERT INTO socios_dados_pessoais
                (socio_id, rg, sexo, estado_civil, data_nascimento, telefone)
                VALUES (?,?,?,?,?,?)
            `,[socio_id, rg, sexo, estado_civil, data_nascimento, telefone], err2 => {
                if(err2){
                    return response(res).error(500, 'Internal Error')
                }
                conn.query("UPDATE socios SET status = 1 WHERE id = ?", [socio_id], 
                    (err3)=> {
                        if(err3){
                            return response(res).error(500, 'Internal Error')
                        }
                        response(res).success()
                    } 
                )
            })
        })

    }

    public static listar(req:Request, res:Response){

        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch (error) {
            return response(res).error(401, 'Unauthorized')
        }

        const limite = parseInt(req.body.limite)
        const pagina = (parseInt(req.body.pagina) -1) * limite
        const status = parseInt(req.body.status)
        // opcionais
        const snome = req.body.nome
        const ssobr = req.body.sobrenome
        const scpf  = req.body.cpf

        let more = ' '
        let vars:Array<any> = []
        vars.push(status)

        if(snome){
            more += ' AND nome LIKE ? '
            vars.push(`%${snome}%`)
        }

        if(ssobr){
            more += ' AND sobrenome LIKE ? '
            vars.push(`%${ssobr}%`)
        }

        if(scpf){
            more += ' AND cpf = ? '
            vars.push(scpf)
        }

        const conn = mysqli()

        vars.push(pagina, limite)

        const q = `
            SELECT
                socios.nome,
                socios.sobrenome,
                socios.slug,
                socios.cpf 
            FROM socios
            WHERE status = ?
            ${more}
            ORDER BY id ASC LIMIT ?,?; 
        ` 
        conn.query(q, vars, (err, result) => {
            if(err) return response(res).error(400, 'Bad Request')
            response(res).success(result)
        })
        
    }

    public static mudar_status(req:Request, res:Response){
        /**
         * nao existe      = 0
         * falta usuario   = 1
         * em aprovação    = 2
         * aprovado        = 3
         * bloqueado       = 4
         */
        
        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch (error) {
            return response(res).error(401, 'Unauthorized')
        }

        const status = parseInt(req.body.status)
        const conn   = mysqli()

        conn.query(`
            UPDATE socios SET status = ? WHERE slug = ?
        `, [status, req.body.slug], err => {
            if(err) return response(res).error(500, 'Internal Error')
            response(res).success()
        })
        
    }

}

export default SocioManager