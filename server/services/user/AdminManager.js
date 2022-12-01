"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assertion_1 = __importDefault(require("../../lib/assertion"));
const mysqli_1 = __importDefault(require("../../lib/mysqli"));
const response_1 = __importDefault(require("../../lib/response"));
const jwt_1 = require("../../lib/jwt");
class AdminManager {
    static update(req, res) {
    }
    static add(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user)
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, "Unauthorized");
        }
        const email = req.body.email;
        const senha = req.body.senha;
        const nome = req.body.nome;
        const conn = (0, mysqli_1.default)();
        conn.query("INSERT INTO user (email, senha, ativo) VALUES (?,?,1)", [email, senha], (err, result) => {
            if (err) {
                return (0, response_1.default)(res).error(500, "Internal Error");
            }
            const id = result.insertId;
            const slug = (0, jwt_1.generateSlug)(String(id) + email);
            conn.query("INSERT INTO admin (nome, user_id, slug) VALUES (?,?,?)", [nome, id, slug], err2 => {
                if (err2) {
                    return (0, response_1.default)(res).error(500, "Internal Error");
                }
                (0, response_1.default)(res).success("Admin criado com sucesso");
            });
        });
    }
}
exports.default = AdminManager;
//# sourceMappingURL=AdminManager.js.map