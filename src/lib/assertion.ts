import { Response } from "express"
import response from "./response"
import Admin from "../model/Admin"
import Socio from "../model/Socio"



export default (res:Response) => {

    const obj = {

        isAdmin: (user:any) => {
            if( user == null || !(user instanceof Admin)){
                response(res).error(401, 'unauthorized')
                throw new Error("unauthorized");
            }
            return obj
        },
    
        isSocio: (user:any) => {
            if( user == null || !(user instanceof Socio)){
                response(res).error(401, 'unauthorized')
                throw new Error("unauthorized");
            }
            return obj
        }
    
    }

    return obj

}