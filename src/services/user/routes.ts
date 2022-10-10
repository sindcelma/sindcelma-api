import { Router } from "express";
import SocioManager from "./SocioManager";
import AuthService from './AuthService';


const router = Router()

export default () => {

    // admin

    // user
    router.get('/rememberme', AuthService.rememberme)
    router.get('/login', AuthService.login)

    // socio
    router.get('/socio/manager/aprove', SocioManager.list)
    router.get('/socio/manager/block', SocioManager.list)
    router.get('/socio/manager/list', SocioManager.list)
    router.get('/socio/manager/add_dados_profissionais', SocioManager.add_dados_profissionais)
    router.get('/socio/manager/add_dados_pessoais', SocioManager.add_dados_pessoais)
    router.get('/socio/manager/cadastrar', SocioManager.cadastrar_socio)

    return router

}
