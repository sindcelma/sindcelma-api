"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assertion_1 = __importDefault(require("../../lib/assertion"));
const mysqli_1 = __importDefault(require("../../lib/mysqli"));
const response_1 = __importDefault(require("../../lib/response"));
class CCTManager {
    static list(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user)
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        (0, mysqli_1.default)().query(`
            SELECT 
                id,
                titulo,
                publico
            FROM cct 
        `, (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            (0, response_1.default)(res).success(result);
        });
    }
    static add_cct(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user)
                .assert();
        }
        catch (e) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        if (!req.body.titulo)
            return (0, response_1.default)(res).error(400, 'Bad Request');
        (0, mysqli_1.default)().query(`
            INSERT INTO cct (titulo) VALUES (?)
        `, [req.body.titulo], (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            (0, response_1.default)(res).success({
                cct_id: result.insertId
            });
        });
    }
    static add_item(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user)
                .assert();
        }
        catch (e) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const cct_id = req.body.cct_id;
        const item = req.body.item;
        const resumo = req.body.resumo;
        const texto = req.body.texto;
        const imagem = req.body.imagem;
        if (!cct_id || !item || !resumo || !texto || !imagem)
            return (0, response_1.default)(res).error(400, 'Bad Request');
        (0, mysqli_1.default)().query(`
            INSERT INTO cct_item (cct_id, imagem, item, resumo, texto) VALUES(?,?,?,?,?)
        `, [cct_id, imagem, item, resumo, texto], err => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            (0, response_1.default)(res).success();
        });
    }
    static edit_cct(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user)
                .assert();
        }
        catch (e) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        if (!req.body.titulo || !req.body.cct_id)
            return (0, response_1.default)(res).error(400, 'Bad Request');
        (0, mysqli_1.default)().query(`
            UPDATE cct SET titulo = ? WHERE id = ?
        `, [req.body.titulo, req.body.cct_id], err => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            (0, response_1.default)(res).success();
        });
    }
    static edit_item(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user)
                .assert();
        }
        catch (e) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const cct_item_id = req.body.cct_item_id;
        const item = req.body.item;
        const resumo = req.body.resumo;
        const texto = req.body.texto;
        const imagem = req.body.imagem;
        if (!cct_item_id || !item || !resumo || !texto || !imagem)
            return (0, response_1.default)(res).error(400, 'Bad Request');
        (0, mysqli_1.default)().query(`
            UPDATE cct_item SET 
                imagem = ?,
                item = ?,
                resumo = ?,
                texto = ?
            WHERE id = ? 
        `, [imagem, item, resumo, texto, cct_item_id], err => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            (0, response_1.default)(res).success();
        });
    }
    static delete_cct(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user)
                .assert();
        }
        catch (e) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const cct_id = req.body.cct_id;
        if (!cct_id)
            return (0, response_1.default)(res).error(400, "Bad Request");
        (0, mysqli_1.default)().query(`
            DELETE FROM cct WHERE id = ?
        `, [cct_id], err => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            (0, response_1.default)(res).success();
        });
    }
    static delete_item(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user)
                .assert();
        }
        catch (e) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const cct_item_id = req.body.cct_item_id;
        if (!cct_item_id)
            return (0, response_1.default)(res).error(400, "Bad Request");
        (0, mysqli_1.default)().query(`
            DELETE FROM cct_item WHERE id = ?
        `, [cct_item_id], err => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            (0, response_1.default)(res).success();
        });
    }
    static publish(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user)
                .assert();
        }
        catch (e) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const cct_id = req.body.cct_id;
        const publico = Number(req.body.publico);
        if (!cct_id || !publico || publico > 1 || publico < 0)
            return (0, response_1.default)(res).error(400, "Bad Request");
        (0, mysqli_1.default)().query(`
            UPDATE cct SET publico = ? WHERE id = ?
        `, [publico, cct_id], err => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            (0, response_1.default)(res).success();
        });
    }
}
exports.default = CCTManager;
//# sourceMappingURL=CCTMananger.js.map