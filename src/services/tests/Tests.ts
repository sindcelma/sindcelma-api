import { Request, Response } from "express"
import response from "../../lib/response"
import Config from '../../lib/config';
import fetch from 'node-fetch'

class Tests {

    public static async pair(req:Request, res:Response){
        
        let result = await fetch(`${Config.instance().json().asset}/api/server_file/add_random_fav`, {
            method:'POST',
            body:JSON.stringify(req.body)
        })
        console.log(result)
        response(res).success()
    }
    
    public static api(req:Request, res:Response){
        console.log(Config.instance().getEmailReceiver());
        console.log(Config.instance().getEmailSystem());
        
        return response(res).success({test:"testando"})
    }

    public static setEmail(req:Request, res:Response){
        Config.instance().setEmailReceiver('Outro@gmail.com')
        return response(res).success({test:"ok"})
    }

    public static api_post(req:Request, res:Response){
        return response(res).success(req.body)
    }

    public static logout(req:Request, res:Response){
        return response(res).error(401, 'Unauthorized')
    }

}


export default Tests