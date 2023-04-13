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
const assertion_1 = __importDefault(require("../../lib/assertion"));
const mysqli_1 = __importDefault(require("../../lib/mysqli"));
const response_1 = __importDefault(require("../../lib/response"));
const jwt_1 = require("../../lib/jwt");
class AdminManager {
    static list_permissions(req, res) {
        try {
            (0, assertion_1.default)()
                .isMaster(req.user)
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, "Unauthorized");
        }
        (0, mysqli_1.default)().query(`
            SELECT 
                   id, slug, title as nome
              FROM admin_service
             WHERE ativo = 1 AND NOT slug = 'admin'
        `, (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            (0, response_1.default)(res).success(result);
        });
    }
    static list(req, res) {
        try {
            (0, assertion_1.default)()
                .isMaster(req.user)
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, "Unauthorized");
        }
        (0, mysqli_1.default)().query(`
            SELECT 
                admin.id, 
                admin.nome, 
                user.email,
                admin_service.id    as service_id,
                admin_service.title as service_nome,
                admin_service.slug  as service_slug
            FROM admin 
                 JOIN user ON user.id = admin.user_id 
            LEFT JOIN admin_service_access ON admin_service_access.admin_id = admin.id 
            LEFT JOIN admin_service ON admin_service.id = admin_service_access.admin_service_id
            WHERE NOT master = 1
        `, (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            if (result.length == 0)
                return (0, response_1.default)(res).success([]);
            let admins = [];
            let lastI = -1;
            let lastid = 0;
            for (var i = 0; i < result.length; i++) {
                const admin = result[i];
                let pattern = {
                    id: 0,
                    nome: '',
                    email: '',
                    permissions: []
                };
                let atual = admin.id == lastid && lastI > -1 ? admins[lastI] : pattern;
                if (admin.id != lastid) {
                    lastI++;
                    lastid = admin.id;
                    atual.id = admin.id;
                    atual.nome = admin.nome;
                    atual.email = admin.email;
                    atual.permissions = [];
                    admins.push(atual);
                }
                if (admin.service_id) {
                    atual.permissions.push({
                        id: admin.service_id,
                        slug: admin.service_slug,
                        nome: admin.service_nome
                    });
                }
            }
            (0, response_1.default)(res).success(admins);
        });
    }
    static change_admin(req, res) {
        try {
            (0, assertion_1.default)()
                .isMaster(req.user)
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, "Unauthorized");
        }
        const id = req.body.id;
        if (!id || !req.body.permissoes)
            return (0, response_1.default)(res).error(400, 'Bad Request');
        const perIds = req.body.permissoes;
        const conn = (0, mysqli_1.default)();
        conn.query(`DELETE FROM admin_service_access WHERE admin_id = ?`, [id], err => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            let inst = `INSERT INTO admin_service_access (admin_id, admin_service_id) VALUES `;
            for (let i = 0; i < perIds.length; i++)
                inst += `(${id}, ${perIds[i]}), `;
            inst = inst.substring(0, inst.length - 2);
            conn.query(inst, err => {
                if (err)
                    return (0, response_1.default)(res).error(500, err);
                (0, response_1.default)(res).success();
            });
        });
    }
    static delete_admin(req, res) {
        try {
            (0, assertion_1.default)()
                .isMaster(req.user)
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, "Unauthorized");
        }
        const id = req.body.id;
        if (!id)
            return (0, response_1.default)(res).error(400, 'Bad Request');
        const conn = (0, mysqli_1.default)();
        conn.query(`SELECT user_id FROM admin WHERE id = ?`, [id], (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            const user_id = result[0]['user_id'];
            conn.query(`DELETE FROM admin WHERE id = ?`, [id], err => {
                if (err)
                    return (0, response_1.default)(res).error(500, err);
                conn.query(`DELETE FROM user WHERE id = ?`, [user_id], err => {
                    if (err)
                        return (0, response_1.default)(res).error(500, err);
                    (0, response_1.default)(res).success();
                });
            });
        });
    }
    static add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, assertion_1.default)()
                    .isMaster(req.user)
                    .assert();
            }
            catch (error) {
                return (0, response_1.default)(res).error(401, "Unauthorized");
            }
            const email = req.body.email;
            const senha = req.body.senha;
            const nome = req.body.nome;
            if (!email || !senha || !nome)
                return (0, response_1.default)(res).error(400, 'Bad Request');
            const pass = yield (0, jwt_1.hashPass)(senha);
            const perIds = req.body.permissoes;
            const conn = (0, mysqli_1.default)();
            conn.query("INSERT INTO user (email, senha, ativo) VALUES (?,?,1)", [email, pass], (err, result) => {
                if (err)
                    return (0, response_1.default)(res).error(500, err);
                const id = result.insertId;
                const slug = (0, jwt_1.generateSlug)(String(id) + email);
                conn.query("INSERT INTO admin (nome, user_id, slug) VALUES (?,?,?)", [nome, id, slug], (err2, result2) => {
                    if (err2)
                        return (0, response_1.default)(res).error(500, "Internal Error");
                    const idAdm = result2.insertId;
                    if (perIds.length > 0) {
                        let insert = `INSERT INTO admin_service_access (admin_id, admin_service_id) VALUES `;
                        for (let i = 0; i < perIds.length; i++) {
                            const idService = perIds[i];
                            insert += `(${idAdm}, ${idService}), `;
                        }
                        conn.query(insert.substring(0, insert.length - 2), err3 => {
                            if (err3)
                                return (0, response_1.default)(res).error(500, err3);
                            (0, response_1.default)(res).success({
                                id: idAdm
                            });
                        });
                    }
                    else {
                        (0, response_1.default)(res).success({
                            id: idAdm
                        });
                    }
                });
            });
        });
    }
}
exports.default = AdminManager;
//# sourceMappingURL=AdminManager.js.map