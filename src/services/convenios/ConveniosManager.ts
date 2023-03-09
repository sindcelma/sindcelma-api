import { Request, Response } from 'express'
import assertion from '../../lib/assertion'
import response from '../../lib/response'
import mysqli from '../../lib/mysqli'


class ConveniosManager {

    static add(req:Request, res:Response){

        try {
            assertion()
            .isAdmin(req.user, 'convenios')
            .assert()
        } catch(e){
            return response(res).error(401, 'Unauthorized')
        }

        const titulo = req.body.titulo 
        const imagem = req.body.imagem
        const descr  = req.body.descricao

        if(!titulo || !imagem || !descr) 
            return response(res).error(400, 'Bad Request')

        mysqli().query("INSERT INTO convenios (titulo, imagem, descricao) VALUES (?,?,?)", 
            [titulo, imagem, descr], (err, result) => {
                if(err) return response(res).error(500, err)
                response(res).success({id:result.insertId})
            })

    }

    static edit(req:Request, res:Response){

        try {
            assertion()
            .isAdmin(req.user, 'convenios')
            .assert()
        } catch(e){
            return response(res).error(401, 'Unauthorized')
        }

        const id     = req.body.id 
        const titulo = req.body.titulo 
        const imagem = req.body.imagem
        const descr  = req.body.descricao

        if(!id || !titulo || !imagem || !descr) 
            return response(res).error(400, 'Bad Request')

        mysqli().query(`
            UPDATE convenios
                SET titulo = ?,
                imagem = ?,
                descricao = ?
            WHERE id = ?
        `, 
            [titulo, imagem, descr, id], err => {
                if(err) return response(res).error(500, err)
                response(res).success()
            })

    }

    static delete(req:Request, res:Response){

        try {
            assertion()
            .isAdmin(req.user, 'convenios')
            .assert()
        } catch(e){
            return response(res).error(401, 'Unauthorized')
        }

        const id = req.body.id 

        if(!id) return response(res).error(400, 'Bad Request')

        mysqli().query(`
            DELETE FROM convenios
            WHERE id = ?
        `, 
            [id], err => {
                if(err) return response(res).error(500, err)
                response(res).success()
            })
    }

}

export default ConveniosManager