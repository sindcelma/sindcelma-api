"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SocioManager_1 = __importDefault(require("./SocioManager"));
const AuthService_1 = __importDefault(require("./AuthService"));
const UserManager_1 = __importDefault(require("./UserManager"));
const router = (0, express_1.Router)();
exports.default = () => {
    // admin
    // user
    router.post('/change_password', AuthService_1.default.change_password);
    router.post('/generate_temp_key', AuthService_1.default.generate_temp_key);
    router.post('/recover', AuthService_1.default.recover);
    router.post('/check_code_recover', AuthService_1.default.check_code_recover);
    router.post('/change_pass_using_code', AuthService_1.default.change_pass_using_code);
    router.post('/create', UserManager_1.default.create_user);
    router.post('/check_session', AuthService_1.default.check_session); // apagar depois
    router.post('/check_email', UserManager_1.default.check_email);
    router.post('/rememberme', AuthService_1.default.rememberme);
    router.post('/login', AuthService_1.default.login);
    router.post('/close_all_sessions', UserManager_1.default.close_all_sessions);
    router.post('/check_login', UserManager_1.default.check_login);
    // socios
    router.post('/socios/update_doc_by_np', SocioManager_1.default.update_doc_by_np);
    router.post('/socios/check_status', SocioManager_1.default.check_status);
    router.post('/socios/cadastrar_full_socio', SocioManager_1.default.cadastrar_full_socio);
    router.post('/socios/cadastrar_usuario', SocioManager_1.default.cadastrar_usuario);
    router.post('/socios/delete_usuario', SocioManager_1.default.delete_usuario);
    router.post('/socios/cadastrar_socio', SocioManager_1.default.cadastrar_socio);
    router.post('/socios/add_dados_profissionais', SocioManager_1.default.add_dados_profissionais);
    router.post('/socios/add_dados_pessoais', SocioManager_1.default.add_dados_pessoais);
    router.post('/socios/listar', SocioManager_1.default.listar);
    router.post('/socios/mudar_status', SocioManager_1.default.mudar_status);
    router.post('/socios/get_socio_por_login', SocioManager_1.default.get_socio_by_login);
    router.post('/socios/get_dados_profissionais', SocioManager_1.default.get_dados_profissionais);
    router.post('/socios/get_dados_pessoais', SocioManager_1.default.get_dados_pessoais);
    router.post('/socios/update_email', SocioManager_1.default.update_email);
    router.post('/socios/update_dados_socio', SocioManager_1.default.update_dados_socio);
    router.post('/socios/update_dados_profissionais', SocioManager_1.default.update_dados_profissionais);
    router.post('/socios/update_dados_pessoais', SocioManager_1.default.update_dados_pessoais);
    router.post('/socios/check_document', SocioManager_1.default.check_document);
    return router;
};
//# sourceMappingURL=routes.js.map