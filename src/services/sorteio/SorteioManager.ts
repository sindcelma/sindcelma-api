import { Request, Response } from 'express'
import assertion from '../../lib/assertion'
import mysqli from '../../lib/mysqli'
import response from '../../lib/response'
import { dateFormat } from '../../lib/data'

class SorteioManager {

    public static sortear(req:Request, res:Response){
        // - pegar dados do sorteio
        // - pegar participantes 
        // - analisar quantos vencedores possiveis 
        // - randomizar, salvar no banco de dados e enviar para 
        //   o firestore até acabar a quantidade de vencedores 
    }

    public static add(req:Request, res:Response){

        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch(e){
            return response(res).error(401, 'Unauthorized')
        }

        const titulo  = req.body.titulo,
              premios = req.body.premios,
              qt_venc = Number(req.body.qt_venc),
              data_so = dateFormat(req.body.data_so, 'yyyy-MM-dd H:i:s'),
              data_in = dateFormat(req.body.data_in, 'yyyy-MM-dd H:i:s')
        
        if(new Date(data_so.toString()) > new Date(data_in.toString()))
            return response(res).error(400, 'Bad Request - A data de inscrição não pode ser maior que a data do sorteio')
        

        mysqli().query(`
            INSERT INTO sorteios (titulo, premios, qt_vencedores, data_sorteio, data_inscricao, ativo)
            VALUES (?,?,?,?,?,0)
        `, [titulo, premios, qt_venc, data_so, data_in], err => {
            if(err) return response(res).error(500, 'Internal Error')
            response(res).success()
        })

    }

    public static update(req:Request, res:Response){

        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch(e){
            return response(res).error(401, 'Unauthorized')
        }

        const titulo    = req.body.titulo,
              premios   = req.body.premios,
              soteio_id = Number(req.body.soteio_id),
              qt_venc   = Number(req.body.qt_venc),
              data_so   = dateFormat(req.body.data_so, 'yyyy-MM-dd H:i:s'),
              data_in   = dateFormat(req.body.data_in, 'yyyy-MM-dd H:i:s')
    
        if(new Date(data_so.toString()) > new Date(data_in.toString()))
            return response(res).error(400, 'Bad Request - A data de inscrição não pode ser maior que a data do sorteio')
  
        mysqli().query(`
            UPDATE sorteios SET 
            titulo = ?,
            premios = ?, 
            qt_vencedores = ?, 
            data_sorteio = ?, 
            data_inscricao = ?
            WHERE id = ?
        `, [titulo, premios, qt_venc, data_so, data_in, soteio_id], err => {
            if(err) return response(res).error(500, 'Internal Error')
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

        let ativo     = Number(req.body.ativo),
            soteio_id = Number(req.body.soteio_id)
        
        if(ativo > 1) ativo = 1

        mysqli().query(`
            UPDATE sorteios SET 
            ativo = ?,
            WHERE id = ?
        `, [ativo, soteio_id], err => {
            if(err) return response(res).error(500, 'Internal Error')
            response(res).success()
        })

    }
    
}

export default SorteioManager