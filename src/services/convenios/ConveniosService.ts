import { Request, Response } from 'express'
import response from '../../lib/response'
import mysqli from '../../lib/mysqli'


class ConveniosService {

    static list(req:Request, res:Response){

        mysqli().query("SELECT id, titulo, imagem, descricao as texto FROM convenios", (err, result) => {
            if(err) return response(res).error(500, err)
            response(res).success(result)
        })

    }

    static selected(req:Request, res:Response){

        const id = req.body.id 

        if(!id) response(res).error(400, 'Bad Request')
 
        mysqli().query("SELECT titulo, imagem, descricao FROM convenios WHERE id = ?", 
            [id], (err, result) => {
                if(err) return response(res).error(500, err)
                response(res).success(result)
            })

    }

}


export default ConveniosService