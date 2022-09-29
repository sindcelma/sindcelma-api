import { Router } from "express";
import SocioManager from "./SocioManager";


const router = Router()

export default () => {

    router.get('/manager/list', SocioManager.list)
    router.get('/manager/add', SocioManager.add)
    router.get('/manager/add_empresa', SocioManager.add_empresa)
    return router

}
