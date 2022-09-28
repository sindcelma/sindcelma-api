import { Router } from "express";
import SocioManager from "./SocioManager";


const router = Router()

export default () => {

    router.get('/manager/list', SocioManager.list)
    return router

}
