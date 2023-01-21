"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assertion_1 = __importDefault(require("../../lib/assertion"));
const mysqli_1 = __importDefault(require("../../lib/mysqli"));
const response_1 = __importDefault(require("../../lib/response"));
const data_1 = require("../../lib/data");
class SorteioManager {
    static sortear(req, res) {
        if (!req.body.sorteio_id)
            return (0, response_1.default)(res).error(400, 'Bad Request');
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user)
                .assert();
        }
        catch (e) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const conn = (0, mysqli_1.default)();
        conn.query(`SELECT 
                    participantes.id,
                    sorteio.qt_vencedores,
                    participantes.socio_id,
                    socio.nome,
                    socio.cpf
               FROM sorteio_participantes as participantes
               JOIN socios as socio ON participantes.socio_id = socio.id 
               JOIN sorteios as sorteio ON sorteio.id = participantes.sorteio_id 
              WHERE sorteio.id = ? AND sorteio.ativo = 1`, [Number(req.body.sorteio_id)], (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, 'Server Error');
            if (result.length == 0)
                return (0, response_1.default)(res).error(404, 'Not Found');
            let qt_vencedores = Number(result[0].qt_vencedores);
            var vencedores = [];
            while (qt_vencedores > vencedores.length) {
                let i = Math.floor(Math.random() * result.length);
                const vencedor = result.splice(i, 1);
                vencedores.push(vencedor[0]);
            }
            let insert = `UPDATE sorteio_participantes SET vencedor = 1 WHERE `;
            for (let z = 0; z < vencedores.length; z++) {
                const venc = vencedores[z];
                insert += ` id = ${venc.id} OR `;
            }
            insert = insert.substring(0, insert.length - 3);
            conn.query(insert, err => {
                if (err)
                    return (0, response_1.default)(res).error(500, err);
                (0, response_1.default)(res).success(vencedores);
            });
        });
    }
    static add(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user)
                .assert();
        }
        catch (e) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const titulo = req.body.titulo, premios = req.body.premios, qt_venc = Number(req.body.qt_venc), data_so = (0, data_1.dateFormat)(req.body.data_so, 'yyyy-MM-dd H:i:s'), data_in = (0, data_1.dateFormat)(req.body.data_in, 'yyyy-MM-dd H:i:s');
        if (new Date(data_so.toString()) > new Date(data_in.toString()))
            return (0, response_1.default)(res).error(400, 'Bad Request - A data de inscrição não pode ser maior que a data do sorteio');
        (0, mysqli_1.default)().query(`
            INSERT INTO sorteios (titulo, premios, qt_vencedores, data_sorteio, data_inscricao, ativo)
            VALUES (?,?,?,?,?,0)
        `, [titulo, premios, qt_venc, data_so, data_in], err => {
            if (err)
                return (0, response_1.default)(res).error(500, 'Internal Error');
            (0, response_1.default)(res).success();
        });
    }
    static update(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user)
                .assert();
        }
        catch (e) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const titulo = req.body.titulo, premios = req.body.premios, soteio_id = Number(req.body.soteio_id), qt_venc = Number(req.body.qt_venc), data_so = (0, data_1.dateFormat)(req.body.data_so, 'yyyy-MM-dd H:i:s'), data_in = (0, data_1.dateFormat)(req.body.data_in, 'yyyy-MM-dd H:i:s');
        if (new Date(data_so.toString()) > new Date(data_in.toString()))
            return (0, response_1.default)(res).error(400, 'Bad Request - A data de inscrição não pode ser maior que a data do sorteio');
        (0, mysqli_1.default)().query(`
            UPDATE sorteios SET 
            titulo = ?,
            premios = ?, 
            qt_vencedores = ?, 
            data_sorteio = ?, 
            data_inscricao = ?
            WHERE id = ?
        `, [titulo, premios, qt_venc, data_so, data_in, soteio_id], err => {
            if (err)
                return (0, response_1.default)(res).error(500, 'Internal Error');
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
        let ativo = Number(req.body.ativo), soteio_id = Number(req.body.soteio_id);
        if (ativo > 1)
            ativo = 1;
        (0, mysqli_1.default)().query(`
            UPDATE sorteios SET 
            ativo = ?,
            WHERE id = ?
        `, [ativo, soteio_id], err => {
            if (err)
                return (0, response_1.default)(res).error(500, 'Internal Error');
            (0, response_1.default)(res).success();
        });
    }
}
exports.default = SorteioManager;
//# sourceMappingURL=SorteioManager.js.map