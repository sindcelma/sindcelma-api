import { Request, Response } from 'express'
import mailing from '../../lib/mailing'
import response from '../../lib/response'


class MailingManager {

    public static async salvar(req:Request, res:Response){

        await new Promise(f => setTimeout(f, 1000));

        mailing.salvar_email(req.body.nome, req.body.email, false, s => {
            if(!s) return response(res).error(500, 'Erro ao tentar salvar')
            response(res).success()
        })

    }

}

export default MailingManager