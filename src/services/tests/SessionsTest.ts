import { Request, Response } from "express";
import { generateToken } from '../../lib/jwt'
import assertion from "../../lib/assertion";
import response from "../../lib/response";

class SessionTest {
    
    public static genSessionTest(req:Request, res:Response){
        const email = req.body.email
        const session = generateToken("Admin", {email:email})
        response(res).success({session:session})
    }

    public static checarTipoDeSessao(req:Request, res:Response){
        try {
            assertion(res).isAdmin(req.user).isSocio(req.user)
            response(res).success("ok")
        } catch (error) {
            // nada...
        }
        
    }

}


export default SessionTest