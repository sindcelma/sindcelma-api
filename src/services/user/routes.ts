import { Router } from "express";
import SocioManager from "./SocioManager";


const router = Router()

export default () => {

    // admin

    // user

    // socio
    router.get('/socio/manager/aprove', SocioManager.list)
    router.get('/socio/manager/block', SocioManager.list)
    router.get('/socio/manager/list', SocioManager.list)
    router.get('/socio/manager/add', SocioManager.add)
    router.get('/socio/manager/add_dados_profissionais', SocioManager.add_dados_profissionais)
    router.get('/socio/manager/add_dados_pessoais', SocioManager.add_dados_pessoais)
    return router

}
