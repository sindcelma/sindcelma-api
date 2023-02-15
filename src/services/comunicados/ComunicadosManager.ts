import { Request, Response } from 'express'
import mysqli from '../../lib/mysqli'
import assertion from '../../lib/assertion'
import response from '../../lib/response'


class ComunicadoManager {

    public static add(req:Request, res:Response){
        
        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch (error) {
            return response(res).error(401, 'Bad request')            
        }

        const titulo = req.body.titulo;
        const texto  = req.body.texto;
        const image  = req.body.image;
        const expire = req.body.expire;

        if(!titulo || !expire) return response(res).error(400, 'Bad request')

        mysqli().query(`
            INSERT INTO comunicados (titulo, texto, image, expire)
            VALUES (?,?,?,?)
        `, [titulo, texto, image, expire], err => {
            if(err) return response(res).error(500, err)
            response(res).success()
        })

    }

    public static edit(req:Request, res:Response){

        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch (error) {
            return response(res).error(401, 'Bad request')            
        }

        const com_id = req.body.comunicado_id;
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
            .isAdmin(req.user)
            .assert()
        } catch (error) {
            return response(res).error(401, 'Bad request')            
        }

    }

}


export default ComunicadoManager