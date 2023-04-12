import { Response } from "express"
import template from "./template"

interface resp {
    message:any,
    session?:String
}


export default (res:Response) => {

    return {

        success: (message:any = "") => {
            let resp:resp = { message: message }
            if(res.user != null) resp.session = res.user.getSession()
            res.json(resp)
        },
        
        error: (code:number = 404, message:any = "") => res.status(code).json({ message:message }).end(),

        html: (path:string, vars:{[k: string]: any} = {}, code:number = 200) => {
           
            const html = new template(`html/${path}.html`).replace(vars).content()
            res.setHeader("Content-Type", "text/html")
            res.status(code).send(html)

        }

    }

}