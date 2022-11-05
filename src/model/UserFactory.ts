import { Request, Response } from "express";
import User from "./User";
import Admin from "./Admin";
import Visitante from './Visitante';
import Socio from "./Socio";
import {generateToken, verifyToken, Token, comparePass} from "../lib/jwt";
import mysqli from "../lib/mysqli";


const setDataAdmin = (data:any, admin:Admin):Admin => {
    admin.setSlug(data.slug)
    admin.setNome(data.nome)
    return admin
}

const setDataSocio = (data:any, socio:Socio):Socio => {
    socio.setFullName(data.nome, data.sobrenome)
    socio.setSlug(data.slug)
    socio.setStatus(data.status)
    return socio
}


const getAdmin = (email:String, senha:string, fn:(user:User, error:Boolean, msg:String) => void, remem:Boolean) =>{

    const conn = mysqli()

    try {
        let query = 
                `SELECT 
                    user.id,
                    user.email,
                    user.ativo,
                    admin.slug
                FROM user 
                JOIN admin ON admin.user_id = user.id
                    WHERE user.email = ?
                    AND   user.senha = ?
                    AND   user.ativo = 1`;

        conn.query(query, [email, senha], (err, result) => {
            
            if(err){
                return fn(new Visitante, true, "Internal Error")
            }

            if(result.length > 0){
                
                const res = result[0]
                const user = {
                    id:res.id,
                    email:res.email,
                    ativo:res.ativo == 1
                } 

                const admin = new Admin(user)
                conn.end()
                
                return fn(setDataAdmin(res, admin), false, "")
                
            } 

            conn.end()
            fn(new Visitante, true, "Você digitou e-mail e/ou senha incorretos ou este usuário não existe")
            
        })
    } catch (error) {
        fn(new Visitante, true, "Internal Error")
        conn.end()
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
                user.id,
                user.email,
                user.senha
                 
           FROM  user
           JOIN  socios ON socios.id = user.socio_id 
           
          WHERE  user.email = ?
            `
        ;

        conn.query(query, [email], async (err, result) => {
            
            if(err){
                return fn(new Visitante, true, "Internal Error")
            }

            if(result.length > 0){
                
                const res = result[0]
                const status = await comparePass(senha, res.senha);
                if(!status){
                    return fn(new Visitante, true, "Não autorizado")
                }

                const user = {
                    id:res.id,
                    email:res.email
                } 

                if(res.status > 2){
                    return fn(new Visitante, true, "Sócio Bloqueado")                    
                }

                const socio = new Socio(user)
                conn.end()
                
                return fn(setDataSocio(res, socio), false, "")
                
            } 

            conn.end()
            fn(new Visitante, true, "Você digitou e-mail e/ou senha incorretos, este usuário não existe ou está bloqueado.")
            
        })
    } catch (error) {
        fn(new Visitante, true, "Internal Error")
        conn.end()
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


const getSocioByRememberme = (remembermetk:String, fn:(user:User, error:Boolean, msg:String) => void) => {

    let query:string = `
        SELECT 
            socios.nome,
            socios.sobrenome,
            socios.slug,
            socios.status,
            user.id,
            user.email,
            user.ativo
            
        FROM  user
            JOIN socios ON user.id = socios.user_id 
            JOIN user_devices ON user_devices.user_id = user.id
                    WHERE user_devices.rememberme = ?
                    `

    const conn = mysqli() 
    try {
        conn.query(query, [remembermetk], (err, result) => {
        
            if(err){
                return fn(new Visitante, true, "Internal Error")
            }
    
        
            if(result.length > 0){
                    
                const res = result[0]
                const user = {
                    id:res.id,
                    email:res.email
                } 
    
                if(res.status > 1){
                    return fn(new Visitante, true, "Sócio Bloqueado")                    
                }

                const socio = new Socio(user)
                conn.end()
                
                return fn(setDataSocio(res, socio), false, "")
                
            } 
    
            conn.end()
            fn(new Visitante, true, "Este Token expirou ou não é válido")
        })
    } catch (error) {
        fn(new Visitante, true, "Internal Error")
        conn.end()
    }
}

const getAdminByRememberme = (remembermetk:String, fn:(user:User, error:Boolean, msg:String) => void) => {
    
    let query:string = `
        SELECT 
            user.id,
            user.email,
            user.ativo,
            admin.slug
        FROM user 
            JOIN admin ON admin.user_id = user.id
            JOIN user_devices ON user_devices.user_id = user.id
                    WHERE user_devices.rememberme = ?
                    AND   user.ativo = 1`

    const conn = mysqli() 
    try {
        conn.query(query, [remembermetk], (err, result) => {
        
            if(err){
                return fn(new Visitante, true, "Internal Error")
            }
    
            const res = result[0]
    
            if(result.length > 0){
                    
                const res = result[0]
                const user = {
                    id:res.id,
                    email:res.email,
                    ativo:res.ativo == 1
                } 
    
                const admin = new Admin(user)
                conn.end()
                
                return fn(setDataAdmin(res, admin), false, "")
                
            } 
    
            conn.end()
            fn(new Visitante, true, "Este Token expirou ou não é válido")
        })
    } catch (error) {
        fn(new Visitante, true, "Internal Error")
        conn.end()
    }
    
}

const getUserByRememberme = (type:String, remembermetk:String, fn:(user:User, error:Boolean, msg:String) => void) => {
    switch (type) {
        case "Admin": getAdminByRememberme(remembermetk, fn); break;
        case "Socio": getSocioByRememberme(remembermetk, fn); break;
        default: fn(new Visitante, true, "Este tipo de usuário não existe")
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
    req.user = req.body.session != null ? setUserBySessionToken(String(req.body.session)) : new Visitante()
    req.user.setAgent(req.get('User-Agent'))
    if(!(req.user instanceof Visitante)){
        res.user = req.user
    }
    next()

}

export {
    middleware,
    getUser,
    getUserByRememberme
}
