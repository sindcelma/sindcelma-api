"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysqli_1 = __importDefault(require("../../lib/mysqli"));
const assertion_1 = __importDefault(require("../../lib/assertion"));
const response_1 = __importDefault(require("../../lib/response"));
const firebase_1 = __importDefault(require("../../lib/firebase"));
class ComunicadoManager {
    static add(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user, 'comunicados')
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
        const conn = (0, mysqli_1.default)();
        conn.query(`
            INSERT INTO comunicados (titulo, texto, image, expire)
            VALUES (?,?,?,?)
        `, [titulo, texto, image, expire], err => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            conn.query("SELECT code FROM user_devices WHERE NOT code IS null", (err2, result2) => {
                if (!err2) {
                    let codes = [];
                    for (let i = 0; i < result2.length; i++)
                        codes.push(result2[i].code);
                    firebase_1.default.sendNotification("Comunicado Importante", titulo, codes);
                }
                (0, response_1.default)(res).success();
            });
        });
    }
    static edit(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user, 'comunicados')
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Bad request');
        }
        const com_id = req.body.id;
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
                .isAdmin(req.user, 'comunicados')
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Bad request');
        }
        const id = req.body.id;
        if (!id)
            return (0, response_1.default)(res).error(400, 'Bad Request');
        (0, mysqli_1.default)().query(`UPDATE comunicados SET status = 0 WHERE id = ? `, [id], err => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            (0, response_1.default)(res).success();
        });
    }
}
exports.default = ComunicadoManager;
//# sourceMappingURL=ComunicadosManager.js.map