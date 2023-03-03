import { Request, Response } from 'express';
import assertion from '../../lib/assertion';
import mysqli from '../../lib/mysqli';
import response from '../../lib/response';
import { generateSlug, hashPass } from '../../lib/jwt'

interface PermissionI {
    id:number,
    slug:string,
    nome:string
}

interface AdminI {
    id:number,
    nome:string,
    email:string,
    permissions:PermissionI[],
}

class AdminManager {

    public static list_permissions(req:Request, res:Response){

        try {
            assertion()
            .isMaster(req.user)
            .assert()
        } catch (error) {
            return response(res).error(401, "Unauthorized")
        }

        mysqli().query(`
            SELECT 
                   id, slug, title as nome
              FROM admin_service
             WHERE ativo = 1 AND NOT slug = 'admin'
        `, (err, result) => {
            if(err) return response(res).error(500, err)
            response(res).success(result)
        })

    }

    public static list(req:Request, res:Response){

        try {
            assertion()
            .isMaster(req.user)
            .assert()
        } catch (error) {
            return response(res).error(401, "Unauthorized")
        }

        mysqli().query(`
            SELECT 
                admin.id, 
                admin.nome, 
                user.email,
                admin_service.id    as service_id,
                admin_service.title as service_nome,
                admin_service.slug  as service_slug
            FROM admin 
                 JOIN user ON user.id = admin.user_id 
            LEFT JOIN admin_service_access ON admin_service_access.admin_id = admin.id 
            LEFT JOIN admin_service ON admin_service.id = admin_service_access.admin_service_id
            WHERE NOT master = 1
        `, (err, result) => {
            
            if(err) return response(res).error(500, err)
            if(result.length == 0) return response(res).success([])
            
            let admins:AdminI[] = []
            let lastI  = -1
            let lastid = 0
        

            for (var i = 0; i < result.length; i++) {
                
                const admin = result[i];

                let pattern:AdminI = {
                    id:0,
                    nome:'',
                    email:'',
                    permissions:[]
                }

                let atual = admin.id == lastid && lastI > -1 ? admins[lastI] : pattern

                if(admin.id != lastid){
                    
                    lastI++
                    lastid      = admin.id
                    atual.id    = admin.id
                    atual.nome  = admin.nome
                    atual.email = admin.email

                    atual.permissions = []
                    
                    admins.push(atual);

                }

                if(admin.service_id){
                    atual.permissions.push({
                        id:   admin.service_id,
                        slug: admin.service_slug,
                        nome: admin.service_nome
                    })
                }
                
            }
            
            response(res).success(admins)

        })

    }

    public static change_admin(req:Request, res:Response){
        
        try {
            assertion()
            .isMaster(req.user)
            .assert()
        } catch (error) {
            return response(res).error(401, "Unauthorized")
        }

        const id = req.body.id
        
        if(!id || !req.body.permissoes) return response(res).error(400, 'Bad Request')

        const perIds:number[] = req.body.permissoes
        const conn = mysqli()

        conn.query(`DELETE FROM admin_service_access WHERE admin_id = ?`, [id], err => {
            
            if(err) return response(res).error(500, err)

            let inst = `INSERT INTO admin_service_access (admin_id, admin_service_id) VALUES `
            for (let i = 0; i < perIds.length; i++)
                inst += `(${id}, ${perIds[i]}), `
            inst = inst.substring(0, inst.length-2)

            conn.query(inst, err => {
                if(err) return response(res).error(500, err)
                response(res).success()
            })

        })

    }

    public static delete_admin(req:Request, res:Response){

        try {
            assertion()
            .isMaster(req.user)
            .assert()
        } catch (error) {
            return response(res).error(401, "Unauthorized")
        }

        const id = req.body.id
        if(!id) return response(res).error(400, 'Bad Request')

        const conn = mysqli()

        conn.query(`SELECT user_id FROM admin WHERE id = ?`, [id], (err, result) => {
            
            if(err) return response(res).error(500, err)
            const user_id = result[0]['user_id']
            
            conn.query(`DELETE FROM admin WHERE id = ?`, [id], err => {
                
                if(err) return response(res).error(500, err)
                
                conn.query(`DELETE FROM user WHERE id = ?`, [user_id], err => {
                    if(err) return response(res).error(500, err)
                    response(res).success()
                })

            })

        })

    }
    
    public static async add(req:Request, res:Response) {

        try {
            assertion()
            .isMaster(req.user)
            .assert()
        } catch (error) {
            return response(res).error(401, "Unauthorized")
        }

        const email  = req.body.email
        const senha  = req.body.senha
        const nome   = req.body.nome 
        
        if(!email || !senha || !nome) 
            return response(res).error(400, 'Bad Request')

        const pass = await hashPass(senha)
        const perIds:number[] = req.body.permissoes
        
        const conn = mysqli()

        conn.query("INSERT INTO user (email, senha, ativo) VALUES (?,?,1)", 
            [email, pass], (err, result) => {
                
                if(err) return response(res).error(500, err)
                
                const id   = result.insertId
                const slug = generateSlug(String(id)+email)
                
                conn.query("INSERT INTO admin (nome, user_id, slug) VALUES (?,?,?)",
                    [nome, id, slug], (err2, result2) => {

                        if(err2) return response(res).error(500, "Internal Error")

                        const idAdm = result2.insertId
                        
                        if(perIds.length > 0){
                            let insert = `INSERT INTO admin_service_access (admin_id, admin_service_id) VALUES `
                            for (let i = 0; i < perIds.length; i++) {
                                const idService = perIds[i];
                                insert += `(${idAdm}, ${idService}), `
                            }
                            conn.query(insert.substring(0, insert.length - 2), err3 => {
                                if(err3) return response(res).error(500, err3)
                                response(res).success({
                                    id:idAdm
                                })
                            })
                        } else {
                            response(res).success({
                                id:idAdm
                            })
                        }
                        
                    }
                )
                
            }
        )
    }

}


export default AdminManager