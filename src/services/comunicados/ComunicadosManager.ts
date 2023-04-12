import { Request, Response } from 'express'
import mysqli from '../../lib/mysqli'
import assertion from '../../lib/assertion'
import response from '../../lib/response'
import firebase from '../../lib/firebase'

class ComunicadoManager {

    public static add(req:Request, res:Response){
        
        try {
            assertion()
            .isAdmin(req.user, 'comunicados')
            .assert()
        } catch (error) {
            return response(res).error(401, 'Bad request')            
        }

        const titulo = req.body.titulo;
        const texto  = req.body.texto;
        const image  = req.body.image;
        const expire = req.body.expire;

        if(!titulo || !expire) return response(res).error(400, 'Bad request')

        const conn = mysqli()

        conn.query(`
            INSERT INTO comunicados (titulo, texto, image, expire)
            VALUES (?,?,?,?)
        `, [titulo, texto, image, expire], err => {

            if(err) return response(res).error(500, err)

            conn.query("SELECT code FROM user_devices WHERE NOT code IS null", (err2, result2) => {
                    
                if(!err2){
                    let codes:string[] = []
                    for (let i = 0; i < result2.length; i++)
                        codes.push(result2[i].code)
                    firebase.sendNotification("Comunicado Importante", titulo, codes)
                }

                response(res).success()
            })

        })

    }

    public static edit(req:Request, res:Response){

        try {
            assertion()
            .isAdmin(req.user, 'comunicados')
            .assert()
        } catch (error) {
            return response(res).error(401, 'Bad request')            
        }

        const com_id = req.body.id;
        const titulo = req.body.titulo;
        const texto  = req.body.texto;
        const image  = req.body.image;
        const expire = req.body.expire;

        if(!titulo || !expire) return response(res).error(400, 'Bad request')

        mysqli().query(`
            UPDATE comunicados 
            SET titulo = ?
            ,   texto  = ?
            ,   image  = ?
            ,   expire = ?
            WHERE   id = ?
        `, [titulo, texto, image, expire, com_id], err => {
            if(err) return response(res).error(500, err)
            response(res).success()
        })

    }

    public static status(req:Request, res:Response){

        try {
            assertion()
            .isAdmin(req.user, 'comunicados')
            .assert()
        } catch (error) {
            return response(res).error(401, 'Bad request')            
        }

        const id = req.body.id
        if(!id) return response(res).error(400, 'Bad Request')

        mysqli().query(`UPDATE comunicados SET status = 0 WHERE id = ? `, [id], err => {
            if(err) return response(res).error(500, err)
            response(res).success()
        })

    }

}


export default ComunicadoManager