import { Request, Response } from "express";

console.log("importou socio");


class Socio {

    public static list(req:Request, res:Response){
        res.send("Listagem")
    }

}

export default Socio