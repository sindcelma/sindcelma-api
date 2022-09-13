import { Request, Response } from "express";
import jwt from "../../lib/jwt";


class AuthService {
    
    public static login(req:Request, res:Response){
        
        const email = req.body.email
    
        const hash = jwt.gen({email:email})
        
        res.send({
            user:{email:email},
            session:hash
        })

    }

}

export default AuthService