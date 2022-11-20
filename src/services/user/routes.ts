import { Router } from "express";
import SocioManager from "./SocioManager";
import AuthService from './AuthService';
import UserManager from "./UserManager";


const router = Router()

export default () => {

    // admin

    // user

    router.post('/change_password', AuthService.change_password)
    router.post('/generate_temp_key', AuthService.generate_temp_key)
    router.post('/recover', AuthService.recover)
    router.post('/check_code_recover', AuthService.check_code_recover)
    router.post('/change_pass_using_code', AuthService.change_pass_using_code)

    router.post('/create', UserManager.create_user)
    router.post('/check_session', AuthService.check_session) // apagar depois
    router.post('/check_email', UserManager.check_email)
    router.post('/rememberme', AuthService.rememberme)
    router.post('/login', AuthService.login)
    router.post('/close_all_sessions', UserManager.close_all_sessions)
    router.post('/check_login', UserManager.check_login)

    // socios

    router.post('/socios/check_status', SocioManager.check_status)
    router.post('/socios/cadastrar_full_socio', SocioManager.cadastrar_full_socio)
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

    router.post('/socios/check_document', SocioManager.check_document)
    
    return router

}
