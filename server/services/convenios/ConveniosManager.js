"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assertion_1 = __importDefault(require("../../lib/assertion"));
const response_1 = __importDefault(require("../../lib/response"));
const mysqli_1 = __importDefault(require("../../lib/mysqli"));
class ConveniosManager {
    static add(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user, 'convenios')
                .assert();
        }
        catch (e) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const titulo = req.body.titulo;
        const imagem = req.body.imagem;
        const descr = req.body.descricao;
        if (!titulo || !imagem || !descr)
            return (0, response_1.default)(res).error(400, 'Bad Request');
        (0, mysqli_1.default)().query("INSERT INTO convenios (titulo, imagem, descricao) VALUES (?,?,?)", [titulo, imagem, descr], (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            (0, response_1.default)(res).success({ id: result.insertId });
        });
    }
    static edit(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user, 'convenios')
                .assert();
        }
        catch (e) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const id = req.body.id;
        const titulo = req.body.titulo;
        const imagem = req.body.imagem;
        const descr = req.body.descricao;
        if (!id || !titulo || !imagem || !descr)
            return (0, response_1.default)(res).error(400, 'Bad Request');
        (0, mysqli_1.default)().query(`
            UPDATE convenios
                SET titulo = ?,
                imagem = ?,
                descricao = ?
            WHERE id = ?
        `, [titulo, imagem, descr, id], err => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            (0, response_1.default)(res).success();
        });
    }
    static delete(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user, 'convenios')
                .assert();
        }
        catch (e) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const id = req.body.id;
        if (!id)
            return (0, response_1.default)(res).error(400, 'Bad Request');
        (0, mysqli_1.default)().query(`
            DELETE FROM convenios
            WHERE id = ?
        `, [id], err => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            (0, response_1.default)(res).success();
        });
    }
}
exports.default = ConveniosManager;
//# sourceMappingURL=ConveniosManager.js.map