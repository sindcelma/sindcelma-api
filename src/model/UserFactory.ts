import { Request, Response } from "express";
import User from "./User";
import Visitante from './Visitante';
import Socio from "./Socio";
import {generateToken, verifyToken, Token} from "../lib/jwt";


const getUser = (sessionToken:Token):User => {

    switch (sessionToken.type) {
        case "Socio": return new Socio() 
        default: return new Visitante()
    }

}

const setUserBySessionToken = (sessionToken:string):User => {
    
    const sess:Token = verifyToken(sessionToken)
    const user:User = getUser(sess)
    
    if(sess.status && sess.expired){
        user.setSession(generateToken(sess.type, sess.data))
    }

    return user

}

export default async function(req:Request, res:Response, next?:any){
    req.user = req.body.session != null ? setUserBySessionToken(String(req.body.session)) : new Visitante()
    next()
}