import { Request, Response } from "express";
import User from "./User";
import Admin from "./Admin";
import Visitante from './Visitante';
import Socio from "./Socio";
import { generateToken, verifyToken, Token, comparePass } from "../lib/jwt";
import mysqli from "../lib/mysqli";


const setDataAdmin = (data:any, admin:Admin):Admin => {
    admin.setSlug(data.slug)
    admin.setNome(data.nome)
    admin.setAccess(data.access)
    admin.setMaster(data.master)
    return admin
}

const setDataSocio = (data:any, socio:Socio, full = true):Socio => {
    socio.setFullName(data.nome, data.sobrenome)
    socio.setSlug(data.slug)
    socio.setStatus(data.status)
    if(full){
        socio.setOthersDatas(data);
    }
    return socio
}


const getAdmin = (email:String, senha:string, fn:(user:User, error:Boolean, msg:String) => void, remem:Boolean) =>{

    const conn = mysqli()

    try {
        let query = 
                `SELECT 
                    user.id,
                    user.email,
                    user.version,
                    user.senha,
                    admin.slug
                FROM user 
                JOIN admin ON admin.user_id = user.id
                    WHERE user.email = ?
                `;

        conn.query(query, [email, senha], async (err, result) => {
            
            if(err){
                return fn(new Visitante, true, "Internal Error")
            }

            if(result.length > 0){
                
                const res:{id:Number, email:String, version:Number, senha:string} = result[0]
                const status = await comparePass(senha, res.senha);
                if(!status){
                    return fn(new Visitante, true, "Não autorizado")
                }
                const user = {
                    id:res.id,
                    email:res.email,
                    version:res.version
                } 

                const admin = new Admin(user)
                
                return fn(setDataAdmin(res, admin), false, "")
                
            } 

            fn(new Visitante, true, "Você digitou e-mail e/ou senha incorretos ou este usuário não existe")
            
        })
    } catch (error) {
        fn(new Visitante, true, "Internal Error")
    }

}

const getSocio = (email:String, senha:string, fn:(user:User, error:Boolean, msg:String) => void, remember:Boolean) => {

    const conn = mysqli()

    try {
        let query = 
        `SELECT 
            socios.nome,
            socios.sobrenome,
            socios.slug,
            socios.status,
            socios.salt,
            socios.cpf,
            socios.np,
            user.id,
            user.email,
            user.senha,
            user.version,
            socios_dados_pessoais.rg,
            socios_dados_pessoais.sexo,
            socios_dados_pessoais.estado_civil,
            socios_dados_pessoais.data_nascimento,
            socios_dados_pessoais.telefone,
            socios_dados_profissionais.cargo,
            socios_dados_profissionais.data_admissao,
            socios_dados_profissionais.num_matricula,
            empresas.nome as nome_empresa
        FROM  user
        JOIN  socios ON socios.id = user.socio_id
        LEFT JOIN  socios_dados_pessoais ON socios_dados_pessoais.socio_id = socios.id
        LEFT JOIN  socios_dados_profissionais ON socios_dados_profissionais.socio_id = socios.id
        LEFT JOIN  empresas ON socios_dados_profissionais.empresa_id = empresas.id
       WHERE  user.email = ?`;

        conn.query(query, [email], async (err, result) => {
            
            if(err){
                return fn(new Visitante, true, err.message)
            }

            if(result.length > 0){
                
                const res:{id:number, email:string, status:number, version:number, senha:string} = result[0]

                const status = await comparePass(senha, res.senha);
                if(!status){
                    return fn(new Visitante, true, "Não autorizado")
                }

                const user = {
                    id:res.id,
                    email:res.email,
                    version:res.version
                } 

                if(res.status > 4){
                    return fn(new Visitante, true, "Sócio Inativo")                    
                }

                const socio = new Socio(user)
                
                return fn(setDataSocio(res, socio), false, "")
                
            } 

            fn(new Visitante, true, "Você digitou e-mail e/ou senha incorretos, este usuário não existe ou está bloqueado.")
            
        })
    } catch (error) {
        fn(new Visitante, true, "Internal Error")
    }

}

const getUser = (type:String, email:String, senha:string, fn:(user:User, error:Boolean, msg:String) => void, remember:Boolean = false) => {
    
    switch (type) {
        case "Admin": getAdmin(email, senha, fn, remember); break;
        case "Socio": getSocio(email, senha, fn, remember); break;
        default: fn(new Visitante, true, "Este tipo de usuário não existe")
    }
    
}

const genAdmin = (dataToken:any):User => {
    const adm = new Admin(dataToken)
    return setDataAdmin(dataToken, adm)
}


const getSocioByRememberme = (remembermetk:String, fn:(user:User, error:Boolean, codeError:Number, msg:String) => void) => {

    let query:string = `
        SELECT 
            socios.nome,
            socios.sobrenome,
            socios.slug,
            socios.status,
            socios.salt,
            socios.cpf,
            socios.np,
            user.id,
            user.email,
            user.senha,
            user.version,
            socios_dados_pessoais.rg,
            socios_dados_pessoais.sexo,
            socios_dados_pessoais.estado_civil,
            socios_dados_pessoais.data_nascimento,
            socios_dados_pessoais.telefone,
            socios_dados_profissionais.cargo,
            socios_dados_profissionais.data_admissao,
            socios_dados_profissionais.num_matricula,
            user_devices.code as hasCodeDev,
            empresas.nome as nome_empresa
            
        FROM  user
            JOIN socios ON user.socio_id = socios.id 
            LEFT JOIN socios_dados_pessoais ON socios_dados_pessoais.socio_id = socios.id
            LEFT JOIN socios_dados_profissionais ON socios_dados_profissionais.socio_id = socios.id
            LEFT JOIN user_devices ON user_devices.user_id = user.id
            LEFT JOIN empresas ON socios_dados_profissionais.empresa_id = empresas.id
                    WHERE user_devices.rememberme = ?
                    `

    const conn = mysqli() 
    try {
        conn.query(query, [remembermetk], (err, result) => {
        
            if(err){
                return fn(new Visitante, true, 1, "Internal Error 1")
            }
        
            if(result.length > 0){
                    
                const res = result[0]

                const user = {
                    id:res.id,
                    email:res.email,
                    version:res.version
                } 
    
                if(res.status > 4){
                    return fn(new Visitante, true, 2, "Sócio Bloqueado")                    
                }

                const socio = new Socio(user)
                
                return fn(setDataSocio(res, socio), false, 0, "")
                
            } 
    
            fn(new Visitante, true, 3, "Este Token expirou ou não é válido")
        })
    } catch (error) {
        fn(new Visitante, true, 4, "Internal Error 2")
    }
}

const getAdminByRememberme = (remembermetk:String, fn:(user:User, error:Boolean, codeError:Number, msg:String) => void) => {
    
    let query:string = `
        SELECT user.id
             , user.email
             , user.version
             , admin.slug
             , admin.nome
             , admin.master
             , admin_service.slug as slug_service
        FROM user 
            JOIN admin ON admin.user_id = user.id
            JOIN user_devices ON user_devices.user_id = user.id
                LEFT JOIN 
                    admin_service_access ON admin.id = admin_service_access.admin_id
                LEFT JOIN 
                    admin_service ON admin_service.id = admin_service_access.admin_service_id
            WHERE user_devices.rememberme = ?
            ORDER BY admin_service.id ASC
                    `

    const conn = mysqli() 
    try {
        conn.query(query, [remembermetk], (err, result) => {
        
            if(err){
                return fn(new Visitante, true, 1, "Internal Error")
            }
    
        
            if(result.length > 0){
                    
                const res:{
                    id:number, 
                    email:string, 
                    version:number,
                    slug:string, 
                    nome:string, 
                    sobrenome:string, 
                    status:number,
                    access:string[]
                } = result[0]

                res.access = []

                for (let i = 0; i < result.length; i++) {
                    if(result[i].slug_service != null){
                        res.access.push(result[i].slug_service)
                    }
                }

                const user = {
                    id:res.id,
                    email:res.email,
                    version:res.version
                } 
    
                const admin = new Admin(user)
                
                return fn(setDataAdmin(res, admin), false, 0, "")
                
            } 
    
            fn(new Visitante, true, 3, "Este Token expirou ou não é válido")
        })
    } catch (error2) {
        fn(new Visitante, true, 4, String(error2))
    }
    
}

const getUserByRememberme = (type:String, remembermetk:String, fn:(user:User, error:Boolean, codeError:Number, msg:String) => void) => {
    switch (type) {
        case "Admin": getAdminByRememberme(remembermetk, fn); break;
        case "Socio": getSocioByRememberme(remembermetk, fn); break;
        default: fn(new Visitante, true, 5, "Este tipo de usuário não existe")
    }
}

const getUserByToken = (sessionToken:Token):User => {

    if(!sessionToken.status) return new Visitante()

    switch (sessionToken.type) {
        case "Socio": return new Socio(sessionToken.data)
        case "Admin": return genAdmin(sessionToken.data) 
        default: return new Visitante()
    }

}

const setUserBySessionToken = (sessionToken:string):User => {
    
    const sess:Token = verifyToken(sessionToken)
    const user:User = getUserByToken(sess)
    
    user.setSession( sess.status && sess.expired ? generateToken(sess.type, sess.data) : sessionToken)

    return user

}

const middleware = async function(req:Request, res:Response, next?:any){
    
    const user = req.body.session != null ? setUserBySessionToken(String(req.body.session)) : new Visitante()
    
    const conn = mysqli();

    if(user instanceof Socio){
        
        conn.query(`
            SELECT 
                user.id, 
                socios.slug,
                socios.nome,
                socios.sobrenome,
                socios.status
            FROM user 
            JOIN socios ON socios.id = user.socio_id
            WHERE user.id = ? AND user.version = ?
        `, [user.getId(), user.getVersion()], (err, result) => {

            if(err) console.log(err)

            if(result.length == 0){
                req.user = new Visitante()
            } else {
                const userres:{
                    id:number, 
                    slug:string, 
                    nome:string, 
                    sobrenome:string, 
                    status:number
                } = result[0];

                req.user = setDataSocio(userres, user, false)
                res.user = req.user
            }
            next()
        });

    } 
    else if(user instanceof Admin) {
        conn.query(
            `SELECT user.id
                  , admin.slug
                  , admin.nome
                  , admin.master
                  , admin_service.slug as slug_service
             FROM user 
             JOIN admin ON admin.user_id = user.id
             LEFT JOIN 
                   admin_service_access ON admin.id = admin_service_access.admin_id
             LEFT JOIN 
                   admin_service ON admin_service.id = admin_service_access.admin_service_id
            WHERE user.id = ? AND user.version = ?
            ORDER BY admin_service.id ASC
            `, [user.getId(), user.getVersion()], (err, result) => {
                if(err) console.log(err)

                if(result.length == 0){
                    req.user = new Visitante()
                } else {
                    const userres:{
                        id:number, 
                        slug:string, 
                        nome:string, 
                        sobrenome:string, 
                        status:number,
                        access:string[]
                    } = result[0];

                    userres.access = []

                    for (let i = 0; i < result.length; i++) {
                        if(result[i].slug_service != null){
                            userres.access.push(result[i].slug_service)
                        }
                    }

                    req.user = setDataAdmin(userres, user)
                    res.user = req.user
                }
                next()
            })
    }
    else {
        req.user = user
        next()
    }

}

export {
    middleware,
    getUser,
    getUserByRememberme
}
