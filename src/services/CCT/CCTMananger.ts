import { Request, Response } from "express";
import assertion from "../../lib/assertion";
import mysqli from "../../lib/mysqli";
import response from "../../lib/response";


class CCTManager {

    public static list(req:Request, res:Response){
        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch (error) {
            return response(res).error(401, 'Unauthorized')
        }

        mysqli().query(`
            SELECT 
                id,
                titulo,
                publico
            FROM cct 
        `, (err, result) => {
            if(err) return response(res).error(500, err)
            response(res).success(result)
        })
        
    }

    public static add_cct(req:Request, res:Response){
        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch(e){
            return response(res).error(401, 'Unauthorized')
        }

        if(!req.body.titulo)
            return response(res).error(400, 'Bad Request')

        mysqli().query(`
            INSERT INTO cct (titulo) VALUES (?)
        `, [req.body.titulo], (err, result) => {
            if(err) return response(res).error(500, err)
            response(res).success({
                cct_id:result.insertId
            })
        })
    }

    public static add_item(req:Request, res:Response){

        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch(e){
            return response(res).error(401, 'Unauthorized')
        }
        
        const cct_id = req.body.cct_id
        const item   = req.body.item
        const resumo = req.body.resumo
        const texto  = req.body.texto
        const imagem = req.body.imagem

        if(!cct_id || !item || !resumo || !texto || !imagem)
            return response(res).error(400, 'Bad Request')

        mysqli().query(`
            INSERT INTO cct_item (cct_id, imagem, item, resumo, texto) VALUES(?,?,?,?,?)
        `, [cct_id, imagem, item, resumo, texto], err => {
            if(err) return response(res).error(500, err)
            response(res).success()
        })

    }

    public static edit_cct(req:Request, res:Response){
        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch(e){
            return response(res).error(401, 'Unauthorized')
        }

        if(!req.body.titulo || !req.body.cct_id)
            return response(res).error(400, 'Bad Request')


        mysqli().query(`
            UPDATE cct SET titulo = ? WHERE id = ?
        `, [req.body.titulo, req.body.cct_id], err => {
            if(err) return response(res).error(500, err)
            response(res).success()
        })

    }

    public static edit_item(req:Request, res:Response){
        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch(e){
            return response(res).error(401, 'Unauthorized')
        }
        
        const cct_item_id = req.body.cct_item_id
        const item   = req.body.item
        const resumo = req.body.resumo
        const texto  = req.body.texto
        const imagem = req.body.imagem

        if(!cct_item_id || !item || !resumo || !texto || !imagem)
            return response(res).error(400, 'Bad Request')

        mysqli().query(`
            UPDATE cct_item SET 
                imagem = ?,
                item = ?,
                resumo = ?,
                texto = ?
            WHERE id = ? 
        `, [imagem, item, resumo, texto, cct_item_id], err => {
            if(err) return response(res).error(500, err)
            response(res).success()
        })
    }

    public static delete_cct(req:Request, res:Response){
        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch(e){
            return response(res).error(401, 'Unauthorized')
        }

        const cct_id = req.body.cct_id

        if(!cct_id) return response(res).error(400, "Bad Request")
        
        mysqli().query(`
            DELETE FROM cct WHERE id = ?
        `, [cct_id], err => {
            if(err) return response(res).error(500, err)
            response(res).success()
        })

    }

    public static delete_item(req:Request, res:Response){
        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch(e){
            return response(res).error(401, 'Unauthorized')
        }

        const cct_item_id = req.body.cct_item_id

        if(!cct_item_id) return response(res).error(400, "Bad Request")
        
        mysqli().query(`
            DELETE FROM cct_item WHERE id = ?
        `, [cct_item_id], err => {
            if(err) return response(res).error(500, err)
            response(res).success()
        })

    }

    public static publish(req:Request, res:Response){
        
        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch(e){
            return response(res).error(401, 'Unauthorized')
        }

        const cct_id  = req.body.cct_id
        const publico = Number(req.body.publico)

        if(!cct_id || !publico || publico > 1 || publico < 0) 
            return response(res).error(400, "Bad Request")

        mysqli().query(`
            UPDATE cct SET publico = ? WHERE id = ?
        `, [publico, cct_id], err => {
            if(err) return response(res).error(500, err)
            response(res).success()
        })

    }

}

export default CCTManager