"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assertion_1 = __importDefault(require("../../lib/assertion"));
const response_1 = __importDefault(require("../../lib/response"));
const mysqli_1 = __importDefault(require("../../lib/mysqli"));
const firebase_1 = __importDefault(require("../../lib/firebase"));
class NoticiasManager {
    static add(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user, 'noticias')
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const titulo = req.body.titulo;
        const subtt = req.body.subtitulo;
        const imagem = req.body.imagem;
        const text = req.body.text;
        if (!titulo || !imagem || !text || !imagem)
            return (0, response_1.default)(res).error(400, 'Bad Request');
        const conn = (0, mysqli_1.default)();
        conn.query(`
            INSERT INTO 
            noticias (titulo, imagem, subtitulo, text, data_created) 
            VALUES (?,?,?,?, now())`, [titulo, imagem, subtt, text], (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, 'Server Error');
            conn.query("SELECT code FROM user_devices WHERE NOT code IS null", (err2, result2) => {
                if (!err2) {
                    let codes = [];
                    for (let i = 0; i < result2.length; i++)
                        codes.push(result2[i].code);
                    firebase_1.default.sendNotification("Noticias", titulo, codes);
                }
                (0, response_1.default)(res).success({ id: result.insertId });
            });
        });
    }
    static edit(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user, 'noticias')
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const id = Number(req.body.id);
        const titulo = req.body.titulo;
        const imagem = req.body.imagem;
        const text = req.body.text;
        const subtt = req.body.subtitulo;
        if (!titulo || !imagem || !text || !id || !subtt)
            return (0, response_1.default)(res).error(400, 'Bad Request');
        (0, mysqli_1.default)().query(`
            UPDATE noticias 
            SET titulo    = ? 
            ,   imagem    = ?
            ,   text      = ?
            ,   subtitulo = ?
            ,   editado   = 1
            WHERE id = ?`, [titulo, imagem, text, subtt, id], err => {
            if (err)
                return (0, response_1.default)(res).error(500, 'Server Error');
            (0, response_1.default)(res).success();
        });
    }
    static delete(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user, 'noticias')
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const id = Number(req.body.id);
        if (!id)
            return (0, response_1.default)(res).error(400, 'Bad Request');
        (0, mysqli_1.default)().query(`
            DELETE FROM noticias 
            WHERE id = ?`, [id], err => {
            if (err)
                return (0, response_1.default)(res).error(500, 'Server Error');
            (0, response_1.default)(res).success();
        });
    }
}
exports.default = NoticiasManager;
//# sourceMappingURL=NoticiasManager.js.map