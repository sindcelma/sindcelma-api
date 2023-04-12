import { Request, Response } from 'express'
import assertion from '../../lib/assertion'
import response from '../../lib/response'
import mysqli from '../../lib/mysqli'
import firebase from '../../lib/firebase'

class NoticiasManager {

    static add(req:Request, res:Response) {
        
        try {
            assertion()
            .isAdmin(req.user, 'noticias')
            .assert()
        } catch (error) {
            return response(res).error(401, 'Unauthorized')
        }

        const titulo = req.body.titulo
        const subtt  = req.body.subtitulo
        const imagem = req.body.imagem 
        const text   = req.body.text

        if(!titulo || !imagem || !text || !imagem )
            return response(res).error(400, 'Bad Request')

        const conn = mysqli()

        conn.query(`
            INSERT INTO 
            noticias (titulo, imagem, subtitulo, text, data_created) 
            VALUES (?,?,?,?, now())`,
            [titulo, imagem, subtt, text], (err, result) => {
                
                if(err) return response(res).error(500, 'Server Error')

                conn.query("SELECT code FROM user_devices WHERE NOT code IS null", (err2, result2) => {
                    
                    if(!err2){
                        let codes:string[] = []
                        for (let i = 0; i < result2.length; i++)
                            codes.push(result2[i].code)
                        firebase.sendNotification("Noticias", titulo, codes)
                    }
    
                    response(res).success({id:result.insertId})
                })
                
            }
        )

    }

    static edit(req:Request, res:Response){
        
        try {
            assertion()
            .isAdmin(req.user, 'noticias')
            .assert()
        } catch (error) {
            return response(res).error(401, 'Unauthorized')
        }

        const id     = Number(req.body.id)
        const titulo = req.body.titulo
        const imagem = req.body.imagem 
        const text   = req.body.text
        const subtt  = req.body.subtitulo

        if(!titulo || !imagem || !text || !id || !subtt)
            return response(res).error(400, 'Bad Request')

        mysqli().query(`
            UPDATE noticias 
            SET titulo    = ? 
            ,   imagem    = ?
            ,   text      = ?
            ,   subtitulo = ?
            ,   editado   = 1
            WHERE id = ?`,
            [titulo, imagem, text, subtt, id], err => {
                if(err) return response(res).error(500, 'Server Error')
                response(res).success()
            }
        )

    }

    static delete(req:Request, res:Response){

        try {
            assertion()
            .isAdmin(req.user, 'noticias')
            .assert()
        } catch (error) {
            return response(res).error(401, 'Unauthorized')
        }

        const id = Number(req.body.id)

        if(!id) return response(res).error(400, 'Bad Request')

        mysqli().query(`
            DELETE FROM noticias 
            WHERE id = ?`,
            [id], err => {
                if(err) return response(res).error(500, 'Server Error')
                response(res).success()
            }
        )

    }

}


export default NoticiasManager