import { Request, Response } from "express";

class ConvencaoColetiva {
    
    public static list(req:Request, res:Response){
        res.send(req.user)
    }

}

export default ConvencaoColetiva