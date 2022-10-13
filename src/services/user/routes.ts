import { Router } from "express";
import SocioManager from "./SocioManager";
import AuthService from './AuthService';


const router = Router()

export default () => {

    // admin

    // user
    router.post('/rememberme', AuthService.rememberme)
    router.post('/login', AuthService.login)

    // socios
    router.post('/socios/get_socio_por_login', SocioManager.get_socio_by_login)
    router.post('/socios/cadastrar_usuario', SocioManager.cadastrar_usuario)
    router.post('/socios/delete_usuario', SocioManager.delete_usuario)
    router.post('/socios/update_usuario', SocioManager.update_usuario)
    router.post('/socios/cadastrar_socio', SocioManager.cadastrar_socio)
    router.post('/socios/add_dados_profissionais', SocioManager.add_dados_profissionais)
    router.post('/socios/add_dados_pessoais', SocioManager.add_dados_pessoais)
    router.post('/socios/listar', SocioManager.listar)
    router.post('/socios/mudar_status', SocioManager.mudar_status)
    router.post('/socios/update_dados_socio', SocioManager.update_dados_socio)
    router.post('/socios/update_dados_profissionais', SocioManager.update_dados_profissionais)
    router.post('/socios/update_dados_pessoais', SocioManager.update_dados_pessoais)
    
    return router

}
