import { Request, Response } from "express";


class Socio {

    public static list(req:Request, res:Response){
        res.send(req.user)
    }

}

export default Socio