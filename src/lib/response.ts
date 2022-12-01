import { Response } from "express"
import {readFileSync} from 'fs'
import { join } from 'path'
import Config from "./config"

interface resp {
    message:any,
    session?:String
}

//const URL = "http://192.168.0.11:3050";

export default (res:Response) => {

    return {

        success: (message:any = "") => {
            let resp:resp = { message: message }
            if(res.user != null) resp.session = res.user.getSession()
            res.json(resp)
        },
        
        error: (code:number = 404, message:any = "") => res.status(code).json({ message:message }).end(),

        html: (path:string, vars:{[k: string]: any} = {}, code:number = 200) => {

            var html = readFileSync(join(__dirname, `../html/${path}.html`)).toString();
            
            const ks = Object.keys(vars);

            for (let i = 0; i < ks.length; i++) {
                const key = ks[i]
                const val = vars[key];
                const reg = new RegExp(`\\$${key}`, 'g');
                html = html.replace(reg, val)
            }
            
            html = html.replace(/\$url/g, Config.instance().json().url)
            
            res.setHeader("Content-Type", "text/html")
            res.status(code).send(html)

        }

    }

}