import { Request, Response } from 'express';
import assertion from '../../lib/assertion';
import mysqli from '../../lib/mysqli';
import response from '../../lib/response';
import { generateSlug } from '../../lib/jwt'

class AdminManager {

    public static update(req:Request, res:Response){

    }
    
    public static add(req:Request, res:Response){

        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch (error) {
            return response(res).error(401, "Unauthorized")
        }

        const email = req.body.email
        const senha = req.body.senha
        const nome  = req.body.nome 
        
        const conn = mysqli()

        conn.query("INSERT INTO user (email, senha, ativo) VALUES (?,?,1)", 
            [email, senha], (err, result) => {
                
                if(err){
                    conn.end()
                    return response(res).error(500, "Internal Error")
                }
                
                const id   = result.insertId
                const slug = generateSlug(String(id)+email)
                
                conn.query("INSERT INTO admin (nome, user_id, slug) VALUES (?,?,?)",
                    [nome, id, slug], err2 => {
                        if(err2){
                            conn.end()
                            return response(res).error(500, "Internal Error")
                        }
                        response(res).success("Admin criado com sucesso")
                        conn.end()
                    }
                )
                
            }
        )
    }

}


export default AdminManager