import { Request, Response } from 'express'
import response from '../../lib/response'
import mysqli from '../../lib/mysqli'

class NoticiasService {

    static last(req:Request, res:Response){
        mysqli().query(`
            SELECT 
                 id, titulo, data_created, subtitulo, imagem 
            FROM noticias 
            ORDER BY id DESC LIMIT 1`, 
            (err, result) => {
                if(err) return response(res).error(500, err)
                response(res).success(result)
            }
        )
    }

    static list(req:Request, res:Response){
        
        const page = req.params.page ? Number(req.params.page) : 1;
        let search = req.body.search;
        
        if(!page || page < 1) return response(res).error(400, 'Bad Request')

        const limit =  `${(page - 1) * 10},10`

        let ssearch = ""

        if(search){
            search   = `%${search}%`
            ssearch += " WHERE titulo LIKE ? OR text LIKE ? "
        }

        const busca = search ? [search, search] : []

        try {
            mysqli().query(`
                SELECT 
                    id, titulo, data_created, subtitulo, imagem 
                FROM noticias
                ${ssearch}
                ORDER BY id DESC LIMIT ${limit}`, 
                busca, (err, result) => {
                    if(err) return response(res).error(500, err)
                    response(res).success(result)
                }
            )
        } catch (error) {
            return response(res).error(500, error)
        }

    }

    static get(req:Request, res:Response){

        const id = Number(req.params.id)

        if(!id) return response(res).error(400, 'Bad Request')

        try {
            mysqli().query(`
                SELECT 
                    id, titulo, text, imagem, data_created, editado
                    FROM noticias 
                    WHERE id  = ? `, 
                [id], (err, result) => {
                    if(err) return response(res).error(500, err)
                    if(result.length == 0) return response(res).error(404, 'Not Found')
                    response(res).success(result)
                }
            )
        } catch (error) {
            return response(res).error(500, error)
        }
    }

}

export default NoticiasService