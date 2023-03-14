import { Response, Request} from 'express';

import mysqli from '../../lib/mysqli'
import response from '../../lib/response'

class ComunicadosService {

    public static list_active(req:Request, res:Response){
        
        mysqli().query(`
            SELECT * FROM comunicados
            WHERE expire >= now() AND status = 1
            ORDER BY id DESC 
        `, (err, result) => {
            if(err) return response(res).error(500, err)
            return response(res).success(result)
        })

    }

    public static get_last_active(req:Request, res:Response){

        mysqli().query(`
            SELECT * FROM comunicados
            WHERE expire >= now() AND status = 1
            ORDER BY id DESC LIMIT 1
        `, (err, result) => {
            if(err) return response(res).error(500, err)
            return response(res).success(result)
        })

    }

}


export default ComunicadosService