import { Response } from "express"
import response from "./response"
import Admin from "../model/Admin"
import Socio from "../model/Socio"
import User from "../model/User"



export default (res:Response) => {

    const obj = {

        status: false,

        isAdmin: (user:User) => {
            if(obj.status) return obj
            obj.status = user instanceof Admin
            return obj
        },
    
        isSocio: (user:User) => {
            if(obj.status) return obj
            obj.status = user instanceof Socio
            return obj
        },

        assert: () => {
            if(!obj.status){
                response(res).error(401, 'unauthorized')
                throw new Error("unauthorized");
            }
        }
    
    }

    return obj

}