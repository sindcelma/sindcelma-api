"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByRememberme = exports.getUser = exports.middleware = void 0;
const Admin_1 = __importDefault(require("./Admin"));
const Visitante_1 = __importDefault(require("./Visitante"));
const Socio_1 = __importDefault(require("./Socio"));
const jwt_1 = require("../lib/jwt");
const mysqli_1 = __importDefault(require("../lib/mysqli"));
const setDataAdmin = (data, admin) => {
    admin.setSlug(data.slug);
    admin.setNome(data.nome);
    return admin;
};
const setDataSocio = (data, socio, full = true) => {
    socio.setFullName(data.nome, data.sobrenome);
    socio.setSlug(data.slug);
    socio.setStatus(data.status);
    if (full) {
        socio.setOthersDatas(data);
    }
    return socio;
};
const getAdmin = (email, senha, fn, remem) => {
    const conn = (0, mysqli_1.default)();
    try {
        let query = `SELECT 
                    user.id,
                    user.email,
                    user.version,
                    admin.slug
                FROM user 
                JOIN admin ON admin.user_id = user.id
                    WHERE user.email = ?
                    AND   user.senha = ?
                `;
        conn.query(query, [email, senha], (err, result) => {
            if (err) {
                return fn(new Visitante_1.default, true, "Internal Error");
            }
            if (result.length > 0) {
                const res = result[0];
                const user = {
                    id: res.id,
                    email: res.email,
                    version: res.version
                };
                const admin = new Admin_1.default(user);
                return fn(setDataAdmin(res, admin), false, "");
            }
            fn(new Visitante_1.default, true, "Você digitou e-mail e/ou senha incorretos ou este usuário não existe");
        });
    }
    catch (error) {
        fn(new Visitante_1.default, true, "Internal Error");
    }
};
const getSocio = (email, senha, fn, remember) => {
    const conn = (0, mysqli_1.default)();
    try {
        let query = `SELECT 
            socios.nome,
            socios.sobrenome,
            socios.slug,
            socios.status,
            socios.salt,
            socios.cpf,
            socios.np,
            user.id,
            user.email,
            user.senha,
            user.version,
            socios_dados_pessoais.rg,
            socios_dados_pessoais.sexo,
            socios_dados_pessoais.estado_civil,
            socios_dados_pessoais.data_nascimento,
            socios_dados_pessoais.telefone,
            socios_dados_profissionais.cargo,
            socios_dados_profissionais.data_admissao,
            socios_dados_profissionais.num_matricula,
            empresas.nome as nome_empresa
        FROM  user
        JOIN  socios ON socios.id = user.socio_id
        LEFT JOIN  socios_dados_pessoais ON socios_dados_pessoais.socio_id = socios.id
        LEFT JOIN  socios_dados_profissionais ON socios_dados_profissionais.socio_id = socios.id
        LEFT JOIN  empresas ON socios_dados_profissionais.empresa_id = empresas.id
       WHERE  user.email = ?`;
        conn.query(query, [email], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return fn(new Visitante_1.default, true, "Internal Error");
            }
            if (result.length > 0) {
                const res = result[0];
                const status = yield (0, jwt_1.comparePass)(senha, res.senha);
                if (!status) {
                    return fn(new Visitante_1.default, true, "Não autorizado");
                }
                const user = {
                    id: res.id,
                    email: res.email,
                    version: res.version
                };
                if (res.status > 3) {
                    return fn(new Visitante_1.default, true, "Sócio Bloqueado");
                }
                const socio = new Socio_1.default(user);
                return fn(setDataSocio(res, socio), false, "");
            }
            fn(new Visitante_1.default, true, "Você digitou e-mail e/ou senha incorretos, este usuário não existe ou está bloqueado.");
        }));
    }
    catch (error) {
        fn(new Visitante_1.default, true, "Internal Error");
    }
};
const getUser = (type, email, senha, fn, remember = false) => {
    switch (type) {
        case "Admin":
            getAdmin(email, senha, fn, remember);
            break;
        case "Socio":
            getSocio(email, senha, fn, remember);
            break;
        default: fn(new Visitante_1.default, true, "Este tipo de usuário não existe");
    }
};
exports.getUser = getUser;
const genAdmin = (dataToken) => {
    const adm = new Admin_1.default(dataToken);
    return setDataAdmin(dataToken, adm);
};
const getSocioByRememberme = (remembermetk, fn) => {
    let query = `
        SELECT 
            socios.nome,
            socios.sobrenome,
            socios.slug,
            socios.status,
            socios.salt,
            socios.cpf,
            socios.np,
            user.id,
            user.email,
            user.senha,
            user.version,
            socios_dados_pessoais.rg,
            socios_dados_pessoais.sexo,
            socios_dados_pessoais.estado_civil,
            socios_dados_pessoais.data_nascimento,
            socios_dados_pessoais.telefone,
            socios_dados_profissionais.cargo,
            socios_dados_profissionais.data_admissao,
            socios_dados_profissionais.num_matricula,
            empresas.nome as nome_empresa
            
        FROM  user
            JOIN socios ON user.socio_id = socios.id 
            LEFT JOIN socios_dados_pessoais ON socios_dados_pessoais.socio_id = socios.id
            LEFT JOIN socios_dados_profissionais ON socios_dados_profissionais.socio_id = socios.id
            LEFT JOIN user_devices ON user_devices.user_id = user.id
            LEFT JOIN empresas ON socios_dados_profissionais.empresa_id = empresas.id
                    WHERE user_devices.rememberme = ?
                    `;
    const conn = (0, mysqli_1.default)();
    try {
        conn.query(query, [remembermetk], (err, result) => {
            if (err) {
                return fn(new Visitante_1.default, true, 1, "Internal Error 1");
            }
            if (result.length > 0) {
                const res = result[0];
                const user = {
                    id: res.id,
                    email: res.email,
                    version: res.version
                };
                if (res.status > 3) {
                    return fn(new Visitante_1.default, true, 2, "Sócio Bloqueado");
                }
                const socio = new Socio_1.default(user);
                return fn(setDataSocio(res, socio), false, 0, "");
            }
            fn(new Visitante_1.default, true, 3, "Este Token expirou ou não é válido");
        });
    }
    catch (error) {
        fn(new Visitante_1.default, true, 4, "Internal Error 2");
    }
};
const getAdminByRememberme = (remembermetk, fn) => {
    let query = `
        SELECT 
            user.id,
            user.email,
            user.version,
            admin.slug
        FROM user 
            JOIN admin ON admin.user_id = user.id
            JOIN user_devices ON user_devices.user_id = user.id
                    WHERE user_devices.rememberme = ?
                    `;
    const conn = (0, mysqli_1.default)();
    try {
        conn.query(query, [remembermetk], (err, result) => {
            if (err) {
                return fn(new Visitante_1.default, true, 1, "Internal Error");
            }
            if (result.length > 0) {
                const res = result[0];
                const user = {
                    id: res.id,
                    email: res.email,
                    version: res.version
                };
                const admin = new Admin_1.default(user);
                return fn(setDataAdmin(res, admin), false, 0, "");
            }
            fn(new Visitante_1.default, true, 3, "Este Token expirou ou não é válido");
        });
    }
    catch (error) {
        fn(new Visitante_1.default, true, 4, "Internal Error");
    }
};
const getUserByRememberme = (type, remembermetk, fn) => {
    switch (type) {
        case "Admin":
            getAdminByRememberme(remembermetk, fn);
            break;
        case "Socio":
            getSocioByRememberme(remembermetk, fn);
            break;
        default: fn(new Visitante_1.default, true, 5, "Este tipo de usuário não existe");
    }
};
exports.getUserByRememberme = getUserByRememberme;
const getUserByToken = (sessionToken) => {
    if (!sessionToken.status)
        return new Visitante_1.default();
    switch (sessionToken.type) {
        case "Socio": return new Socio_1.default(sessionToken.data);
        case "Admin": return genAdmin(sessionToken.data);
        default: return new Visitante_1.default();
    }
};
const setUserBySessionToken = (sessionToken) => {
    const sess = (0, jwt_1.verifyToken)(sessionToken);
    const user = getUserByToken(sess);
    user.setSession(sess.status && sess.expired ? (0, jwt_1.generateToken)(sess.type, sess.data) : sessionToken);
    return user;
};
const middleware = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.body.session != null ? setUserBySessionToken(String(req.body.session)) : new Visitante_1.default();
        if (user instanceof Socio_1.default) {
            const conn = (0, mysqli_1.default)();
            conn.query(`
            SELECT 
                user.id,
                socios.slug,
                socios.nome,
                socios.sobrenome,
                socios.status
            FROM user 
            JOIN socios ON socios.id = user.socio_id
            WHERE user.id = ? AND user.version = ?
        `, [user.getId(), user.getVersion()], (err, result) => {
                if (err) {
                    console.log(err);
                }
                if (result.length == 0) {
                    req.user = new Visitante_1.default();
                }
                else {
                    const userres = result[0];
                    req.user = setDataSocio(userres, user, false);
                    res.user = req.user;
                }
                next();
            });
        }
        else if (user instanceof Admin_1.default) {
            // injetar administrador
        }
        else {
            req.user = user;
            next();
        }
    });
};
exports.middleware = middleware;
//# sourceMappingURL=UserFactory.js.map