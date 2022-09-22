import { Response } from "express"

interface resp {
    message:any,
    session?:string
}

export default (res:Response) => {

    return {

        success: (message:any = "") => {
            let resp:resp = { message: message }
            if(res.user != null) resp.session = res.user.getSession()
            res.json(resp)
        },
        
        error: (code:number = 404, message:any = "") => res.status(code).json({ message:message }).end()

    }

}