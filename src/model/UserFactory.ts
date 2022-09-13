import { Request, Response } from "express";
import User from "./User";
import Visitante from './Visitante';
import Socio from "./Socio";
import jwt from "../lib/jwt";

const setUserBySession = (session:string):User => {
    const sess = jwt.verify(session)
    const user:User = sess ? new Socio() : new Visitante()
    if(sess && sess.expired){
        user.setSession(jwt.gen(sess.data))
    }
    return user
}

export default async function(req:Request, res:Response, next?:any){
    req.user = req.body.session != null ? setUserBySession(String(req.body.session)) : new Visitante()
    next()
}