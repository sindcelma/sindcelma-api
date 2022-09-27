import { Request, Response } from "express";
import User from "./User";
import Admin from "./Admin";
import Visitante from './Visitante';
import Socio from "./Socio";
import {generateToken, verifyToken, Token} from "../lib/jwt";


const getUser = (sessionToken:Token):User => {

    if(!sessionToken.status) return new Visitante()

    switch (sessionToken.type) {
        case "Socio": return new Socio(sessionToken.data) 
        case "Admin": return new Admin(sessionToken.data) 
        default: return new Visitante()
    }

}

const setUserBySessionToken = (sessionToken:string):User => {
    
    const sess:Token = verifyToken(sessionToken)
    const user:User = getUser(sess)
    
    user.setSession( sess.status && sess.expired ? generateToken(sess.type, sess.data) : sessionToken)

    return user

}

export default async function(req:Request, res:Response, next?:any){

    req.user = req.body.session != null ? setUserBySessionToken(String(req.body.session)) : new Visitante()
    if(!(req.user instanceof Visitante)){
        res.user = req.user
    }
    next()

}