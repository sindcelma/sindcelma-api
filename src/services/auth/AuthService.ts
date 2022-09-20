import { Request, Response } from "express";
// import jwt from "../../lib/jwt";
import mysqli from "../../lib/mysqli";

class AuthService {
    
    public static login(req:Request, res:Response){
        
        const email = req.body.email
        const senha = req.body.senha
        const conn = mysqli()

        try {
            let query = "SELECT * FROM socios WHERE email = ? AND senha = ? AND ativo = 1";
            conn.query(query, [email, senha], (err, result) => {
                console.log(result);
                conn.end()
                res.json(result)
            })
        } catch (error) {
            conn.end()
            res.send("error")
        }

    }

}

export default AuthService