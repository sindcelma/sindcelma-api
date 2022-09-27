import { Request, Response } from "express";
import { generateToken } from "../../lib/jwt"
import mysqli from "../../lib/mysqli";

class AuthService {
    
    public static rememberme(req:Request, res:Response){
        
        const remembermeToken = req.body.rememberme
        const con = mysqli()
        

    }

}

export default AuthService