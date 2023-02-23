"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysqli_1 = __importDefault(require("../../lib/mysqli"));
const assertion_1 = __importDefault(require("../../lib/assertion"));
const response_1 = __importDefault(require("../../lib/response"));
class ComunicadoManager {
    static add(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user)
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Bad request');
        }
        const titulo = req.body.titulo;
        const texto = req.body.texto;
        const image = req.body.image;
        const expire = req.body.expire;
        if (!titulo || !expire)
            return (0, response_1.default)(res).error(400, 'Bad request');
        (0, mysqli_1.default)().query(`
            INSERT INTO comunicados (titulo, texto, image, expire)
            VALUES (?,?,?,?)
        `, [titulo, texto, image, expire], err => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            (0, response_1.default)(res).success();
        });
    }
    static edit(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user)
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Bad request');
        }
        const com_id = req.body.comunicado_id;
        const titulo = req.body.titulo;
        const texto = req.body.texto;
        const image = req.body.image;
        const expire = req.body.expire;
        if (!titulo || !expire)
            return (0, response_1.default)(res).error(400, 'Bad request');
        (0, mysqli_1.default)().query(`
            UPDATE comunicados 
            SET titulo = ?
            ,   texto  = ?
            ,   image  = ?
            ,   expire = ?
            WHERE   id = ?
        `, [titulo, texto, image, expire, com_id], err => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            (0, response_1.default)(res).success();
        });
    }
    static status(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user)
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Bad request');
        }
    }
}
exports.default = ComunicadoManager;
//# sourceMappingURL=ComunicadosManager.js.map