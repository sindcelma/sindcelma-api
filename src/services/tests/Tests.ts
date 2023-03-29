import { Request, Response } from "express"
import response from "../../lib/response"
import Config from '../../lib/config';
import fetch from 'node-fetch'

class Tests {

    public static async change_image(req:Request, res:Response){

    
        let result = await fetch(`${Config.instance().json().asset}/api/admin_file/change_name`, {
            method:'POST',
            body:JSON.stringify(req.body)
        })

        const body = await result.text()
        console.log(body)
        const resp = await JSON.parse(body)
        console.log(resp);
        

        if(resp.code != 200){
            return response(res).error(resp.code, resp.message)
        }
        response(res).success()

    }

    public static async pair(req:Request, res:Response){
        
        let result = await fetch(`${Config.instance().json().asset}/api/server_file/add_random_fav`, {
            method:'POST',
            body:JSON.stringify(req.body)
        })
       
        const body = await result.json()
        console.log(body)

        if(body.code != 200){
            return response(res).error(body.code, body.message)
        }
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