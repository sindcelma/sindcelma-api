import { Request, Response } from "express";
import assertion from "../../lib/assertion";
import response from "../../lib/response";

class SocioManager {


    public static list(req:Request, res:Response){
        
        try {
            assertion(res)
            .isAdmin(req.user)
            .assert()
        } catch (error) {
            return false
        }

        const limit  = req.body.limit 
        const page   = req.body.page
        const search = req.body.search

        response(res).success()
    }

    /**
     * Adicionar sócio
     * coloca-lo pra aprovação
     */
    public static add(req:Request, res:Response){
        

    }

    /**
     * Aprovar sócio
     */
    public static aprove(req:Request, res:Response){
        try {
            assertion(res)
            .isAdmin(req.user)
            .assert()
        } catch (error) {
            return false
        }

        response(res).success()
    }

    /**
     * Editar dados sócio
     */
    public static update(req:Request, res:Response){

    }

}

export default SocioManager