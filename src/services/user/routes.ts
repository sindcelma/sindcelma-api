import { Router } from "express";
import SocioManager from "./SocioManager";
import AuthService from './AuthService';
import UserManager from "./UserManager";
import AdminManager from "./AdminManager";


const router = Router()

export default () => {

    // admin
    
    router.post('/admin/list', AdminManager.list)
    router.post('/admin/add', AdminManager.add)
    router.post('/admin/permissions', AdminManager.list_permissions)
    router.post('/admin/change', AdminManager.change_admin)
    router.post('/admin/delete', AdminManager.delete_admin)

    // user

    router.post('/save_token', UserManager.save_token)
    router.post('/change_password', AuthService.change_password)
    router.post('/generate_temp_key', AuthService.generate_temp_key)
    router.post('/recover', AuthService.recover)
    router.post('/check_code_recover', AuthService.check_code_recover)
    router.post('/change_pass_using_code', AuthService.change_pass_using_code)

    router.post('/create', UserManager.create_user)
    router.post('/get_user', AuthService.get_user)
    router.post('/check_email', UserManager.check_email)
    router.post('/rememberme', AuthService.rememberme)
    router.post('/login', AuthService.login)
    router.post('/close_all_sessions', UserManager.close_all_sessions)
    router.post('/check_login', UserManager.check_login)

    // socios

    router.post('/socios/ghosts', SocioManager.ghosts)
    router.post('/socios/set_ghost', SocioManager.set_ghost)
    router.post('/socios/set_diretor', SocioManager.set_diretor)

    router.post('/socios/save_image', SocioManager.save_image)
    router.post('/socios/get_doc_carteirinha', SocioManager.get_doc_carteirinha)
    router.post('/socios/update_doc_by_np', SocioManager.update_doc_by_np)
    router.post('/socios/check_status', SocioManager.check_status)
    router.post('/socios/cadastrar_full_socio', SocioManager.cadastrar_full_socio)
    router.post('/socios/cadastrar_usuario', SocioManager.cadastrar_usuario)
    router.post('/socios/delete_usuario', SocioManager.delete_usuario)
    router.post('/socios/cadastrar_socio', SocioManager.cadastrar_socio)
    router.post('/socios/add_dados_profissionais', SocioManager.add_dados_profissionais)
    router.post('/socios/add_dados_pessoais', SocioManager.add_dados_pessoais)
    router.post('/socios/listar', SocioManager.listar)
    router.post('/socios/mudar_status', SocioManager.mudar_status)

    router.post('/socios/get_socio_por_login', SocioManager.get_socio_by_login)
    router.post('/socios/get_socio_por_id', SocioManager.get_socio_por_id)
    router.post('/socios/get_dados_profissionais', SocioManager.get_dados_profissionais)
    router.post('/socios/get_dados_pessoais', SocioManager.get_dados_pessoais)
    
    router.post('/socios/update_email', SocioManager.update_email)
    router.post('/socios/update_dados_socio', SocioManager.update_dados_socio)
    router.post('/socios/update_dados_profissionais', SocioManager.update_dados_profissionais)
    router.post('/socios/update_dados_pessoais', SocioManager.update_dados_pessoais)

    router.post('/socios/check_document', SocioManager.check_document)
    
    return router

}
