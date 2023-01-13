import { Request, Response } from "express"
import response from "../../lib/response"

class Tests {
    
    public static api(req:Request, res:Response){
        return response(res).success({test:"testando"})
    }

    public static api_post(req:Request, res:Response){
        return response(res).success(req.body)
    }

    public static logout(req:Request, res:Response){
        return response(res).error(401, 'Unauthorized')
    }

}


export default Tests