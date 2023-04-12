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
const data_1 = require("../../lib/data");
const jwt_1 = require("../../lib/jwt");
const mysqli_1 = __importDefault(require("../../lib/mysqli"));
const response_1 = __importDefault(require("../../lib/response"));
const Socio_1 = __importDefault(require("../../model/Socio"));
const UserFactory_1 = require("../../model/UserFactory");
const aws_1 = __importDefault(require("../../lib/aws"));
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const config_1 = __importDefault(require("../../lib/config"));
const Admin_1 = __importDefault(require("../../model/Admin"));
class AuthService {
    static generate_temp_key(req, res) {
        const senha = req.body.senha;
        if (!senha)
            return (0, response_1.default)(res).error(400);
        const user = req.user;
        if (user instanceof Admin_1.default && user.isMaster()) {
            return (0, response_1.default)(res).error(403, 'Não é permitido alterar dados de Usuário Master');
        }
        const conn = (0, mysqli_1.default)();
        conn.query(`
            SELECT id, senha FROM user WHERE email = ?
        `, [user.getEmail()], (err, result) => __awaiter(this, void 0, void 0, function* () {
            if (err)
                return (0, response_1.default)(res).error(500, 'Internal Error');
            if (result.length == 0)
                return (0, response_1.default)(res).error(404, 'usuario não encontrado');
            const senhaHash = result[0]['senha'];
            const user_id = result[0]['id'];
            if (!(yield (0, jwt_1.comparePass)(senha, senhaHash)))
                return (0, response_1.default)(res).error(402, 'senha incorreta');
            const data = new Date();
            const key = (0, jwt_1.generateSlug)(user.getEmail() + String(data.getMilliseconds()));
            data.setMinutes(data.getMinutes() + 60);
            const dataStr = data.getUTCFullYear() + '-' +
                ('00' + (data.getUTCMonth() + 1)).slice(-2) + '-' +
                ('00' + data.getUTCDate()).slice(-2) + ' ' +
                ('00' + data.getUTCHours()).slice(-2) + ':' +
                ('00' + data.getUTCMinutes()).slice(-2) + ':' +
                ('00' + data.getUTCSeconds()).slice(-2);
            conn.query("UPDATE user SET temp_key = ?, valid_key = ? WHERE id = ?", [key, dataStr, user_id], err => {
                if (err)
                    return (0, response_1.default)(res).error(500, 'Internal Error');
                (0, response_1.default)(res).success({
                    key: key
                });
            });
        }));
    }
    static change_password(req, res) {
        // alterar versão do usuário
        let oldPass = req.body.oldPass;
        let newPass = req.body.newPass;
        if (!req.body.key || !newPass || !oldPass) {
            return (0, response_1.default)(res).error(400, 'bad request');
        }
        let user = req.user;
        const conn = (0, mysqli_1.default)();
        conn.query(`
            SELECT temp_key, senha
            FROM   user
            WHERE  id = ?
        `, [user.getId()], (err1, result) => __awaiter(this, void 0, void 0, function* () {
            if (err1) {
                return (0, response_1.default)(res).error(500, err1);
            }
            if (result.length == 0) {
                return (0, response_1.default)(res).error(404, 'Not Found');
            }
            if (req.body.key != result[0].temp_key) {
                return (0, response_1.default)(res).error(403, 'need refresh key');
            }
            if (!(yield (0, jwt_1.comparePass)(oldPass, result[0].senha))) {
                return (0, response_1.default)(res).error(402, 'senha incorreta');
            }
            const hashNewPass = yield (0, jwt_1.hashPass)(newPass);
            conn.query("UPDATE user SET senha = ? WHERE id = ?", [hashNewPass, user.getId()], err2 => {
                if (err2) {
                    return (0, response_1.default)(res).error(500, 'Este email já está cadastrado');
                }
                conn.query("DELETE FROM user_devices WHERE user_id = ?", [user.getId()]);
                conn.query("UPDATE user SET version = version+1 WHERE id = ?", [user.getId()]);
                (0, response_1.default)(res).success();
            });
        }));
    }
    static get_user(req, res) {
        (0, response_1.default)(res).success(req.user);
    }
    static login(req, res) {
        const email = req.body.email;
        const senha = req.body.senha;
        const remem = req.body.rememberme;
        const type = req.body.type;
        (0, UserFactory_1.getUser)(type, email, senha, (user, error, msg) => __awaiter(this, void 0, void 0, function* () {
            yield new Promise(r => setTimeout(r, 1500));
            if (error) {
                return (0, response_1.default)(res).error(500, msg);
            }
            const token = (0, jwt_1.generateToken)(type, {
                id: user.getId(),
                email: user.getEmail(),
                version: user.getVersion()
            });
            const message = {
                session: token,
                user: user
            };
            message.session = token;
            if (remem) {
                let conn = (0, mysqli_1.default)();
                message.remembermetk = user.getRememberMeToken();
                conn.query("INSERT INTO user_devices (user_id, header, rememberme) VALUES (?,?,?)", [user.getId(), user.getAgent(), message.remembermetk]);
            }
            return (0, response_1.default)(res).success(message);
        }), remem);
    }
    /**
     * testado: false
     */
    static recover(req, res) {
        // gerar o código e enviar via email ou telefone
        // alterar versão do usuário
        let email = req.body.email;
        let cpf = Socio_1.default.transformCpf(req.body.doc);
        let type = req.body.type;
        let to = req.body.to;
        const conn = (0, mysqli_1.default)();
        const query = type == 'Socio' ?
            [
                `
            SELECT 
                user.id, user.email, socios.nome, socios_dados_pessoais.telefone 
            FROM 
                socios 
            JOIN user ON socios.id = user.socio_id 
            LEFT JOIN socios_dados_pessoais ON socios_dados_pessoais.socio_id = socios.id 
            WHERE socios.cpf = ?
            `,
                [cpf]
            ] :
            [
                `SELECT 
                user.id, user.email
            FROM 
                user 
            WHERE user.email = ?`,
                [email]
            ];
        conn.query(String(query[0]), query[1], (err, result) => {
            if (err) {
                return (0, response_1.default)(res).error(500, 'Internal Error 1');
            }
            if (result.length == 0) {
                return (0, response_1.default)(res).error(404, 'Not Found');
            }
            const resUser = result[0];
            let data = new Date();
            data.setHours(data.getHours() + 4);
            const limite = (0, data_1.dateFormat)(data, 'yyyy-MM-dd H:i:s');
            const code = (0, jwt_1.generateCode)();
            conn.query(`
                INSERT INTO user_recover (user_id, data_limite, codigo) VALUES (?,?,?)
            `, [resUser.id, limite, code], (err2) => {
                var _a;
                if (err2) {
                    return (0, response_1.default)(res).error(500, 'Internal Error');
                }
                if (to == 'email') {
                    new aws_1.default().ses()
                        .config({
                        de: config_1.default.instance().getEmailSystem(),
                        para: resUser.email,
                        assunto: "Recuperação de senha",
                        data: {
                            nome: (_a = resUser.nome) !== null && _a !== void 0 ? _a : '',
                            codigo: code
                        }
                    })
                        .setTemplate(fs_1.default.readFileSync((0, path_1.join)(__dirname, '../../html/recover.html')).toString())
                        .send();
                }
                if (to == 'phone') {
                    // envia por telefone
                    console.log(code + " eviado por msg");
                }
                (0, response_1.default)(res).success({
                    email: resUser.email
                });
            });
        });
    }
    /**
     * testado: false
     */
    static check_code_recover(req, res) {
        const email = req.body.email;
        const codigo = req.body.codigo;
        if (!email || !codigo)
            return (0, response_1.default)(res).error(400, 'Bad Request');
        const conn = (0, mysqli_1.default)();
        conn.query(`
          SELECT 
                 user_recover.id
            FROM user_recover 
            JOIN user ON user.id = user_recover.user_id 
           WHERE user_recover.codigo = ?
             AND user_recover.data_limite > now()
             AND user.email = ?`, [codigo, email], (err, result) => __awaiter(this, void 0, void 0, function* () {
            if (err)
                return (0, response_1.default)(res).error(500, 'Server Error 1');
            if (result.length == 0)
                return (0, response_1.default)(res).error();
            const recover_id = result[0]['id'];
            const slugHashCode = yield (0, jwt_1.hashPass)(recover_id + codigo + email);
            conn.query("UPDATE user_recover SET codigo = ? WHERE id = ?", [slugHashCode, recover_id], err => {
                if (err)
                    return (0, response_1.default)(res).error(500, 'Internal Error');
                (0, response_1.default)(res).success({
                    codigo: slugHashCode
                });
            });
        }));
    }
    static change_pass_using_code(req, res) {
        const email = req.body.email;
        const codigo = req.body.codigo;
        const senha = req.body.senha;
        if (!email || !senha || !codigo)
            return (0, response_1.default)(res).error(400, 'Bad Request');
        const conn = (0, mysqli_1.default)();
        conn.query(`
          SELECT 
                 user.id as user_id,
                 user_recover.id
            FROM user_recover 
            JOIN user ON user.id = user_recover.user_id 
           WHERE user_recover.codigo = ?
             AND user.email = ?`, [codigo, email], (err, result) => __awaiter(this, void 0, void 0, function* () {
            if (err)
                return (0, response_1.default)(res).error(500, 'Server Error 1');
            if (result.length == 0)
                return (0, response_1.default)(res).error();
            const recover_id = result[0]['id'];
            const user_id = result[0]['user_id'];
            const pass = yield (0, jwt_1.hashPass)(senha);
            conn.query("UPDATE user SET senha = ? WHERE email = ?", [pass, email], err => {
                if (err)
                    return (0, response_1.default)(res).error(500, 'Internal Error');
                conn.query("DELETE FROM user_recover WHERE id = ?", [recover_id]);
                conn.query("DELETE FROM user_devices WHERE user_id = ?", [user_id]);
                conn.query("UPDATE user SET version = version+1 WHERE id = ?", [user_id]);
                (0, response_1.default)(res).success();
            });
        }));
    }
    static rememberme(req, res) {
        const remembermeToken = req.body.rememberme;
        const type = req.body.type;
        (0, UserFactory_1.getUserByRememberme)(type, remembermeToken, (user, error, codeError, msg) => __awaiter(this, void 0, void 0, function* () {
            yield new Promise(r => setTimeout(r, 1000));
            if (error)
                switch (codeError) {
                    case 2:
                    case 3:
                        return (0, response_1.default)(res).error(401, msg);
                    case 1:
                    case 4:
                        return (0, response_1.default)(res).error(500, msg);
                }
            const message = {
                session: (0, jwt_1.generateToken)(type, {
                    id: user.getId(),
                    email: user.getEmail(),
                    version: user.getVersion()
                }),
                user: user
            };
            (0, response_1.default)(res).success(message);
        }));
    }
}
exports.default = AuthService;
//# sourceMappingURL=AuthService.js.map