"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assertion_1 = __importDefault(require("../../lib/assertion"));
const mysqli_1 = __importDefault(require("../../lib/mysqli"));
const response_1 = __importDefault(require("../../lib/response"));
const data_1 = require("../../lib/data");
const firebase_1 = __importDefault(require("../../lib/firebase"));
class SorteioManager {
    static changeStatus(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user)
                .assert();
        }
        catch (e) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const status = Number(req.body.status);
        const sorteio_id = Number(req.body.sorteio_id);
        if (!sorteio_id)
            return (0, response_1.default)(res).error(400, 'Bad request');
        const conn = (0, mysqli_1.default)();
        conn.query(`
            UPDATE sorteios 
            SET ativo = ?
            WHERE id = ?
        `, [status, sorteio_id], err => {
            if (err)
                return (0, response_1.default)(res).error(500, 'Server error');
            if (status == 1) {
                let quryDevices = `
                    SELECT 
                            user_devices.code
                    FROM  socios 
                    JOIN  user         ON user.socio_id = socios.id 
                    JOIN  user_devices ON user.id = user_devices.user_id 
                    WHERE NOT user_devices.code IS null
                `;
                conn.query(quryDevices, (err2, result2) => {
                    if (err2)
                        return console.log(err2);
                    let devices = [];
                    for (let i = 0; i < result2.length; i++)
                        devices.push(result2[i].code);
                    firebase_1.default.sendNotification(`SORTEIO ATIVO!`, "Inscreva-se! Você pode ser o próximo ganhador!", devices);
                });
            }
            (0, response_1.default)(res).success();
        });
    }
    static list(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user)
                .assert();
        }
        catch (e) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const conn = (0, mysqli_1.default)();
        conn.query(`
            SELECT 
                sorteios.id as sorteio_id,
                sorteios.titulo,
                sorteios.premios,
                sorteios.qt_vencedores,
                sorteios.data_sorteio,
                sorteios.ativo
            FROM   sorteios
            ORDER BY 
                sorteios.id DESC

        `, (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            if (result.length == 0)
                return (0, response_1.default)(res).success([]);
            let sorteios = [];
            for (let i = 0; i < result.length; i++) {
                const data = (0, data_1.dateFormat)(new Date(result[i].data_sorteio), 'dd-MM-yyyy');
                const sorteio = result[i];
                sorteio.data = data;
                sorteios.push(sorteio);
            }
            (0, response_1.default)(res).success(sorteios);
        });
    }
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
                    socio.cpf,
                    socio.id as socio_id
               FROM sorteio_participantes as participantes
               JOIN socios as socio ON participantes.socio_id = socio.id 
               JOIN sorteios as sorteio ON sorteio.id = participantes.sorteio_id 
              WHERE sorteio.id = ? AND sorteio.ativo = 1`, [Number(req.body.sorteio_id)], (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, 'Server Error');
            if (result.length == 0)
                return (0, response_1.default)(res).error(404, 'Não é possível realizar o sorteio pois não há participantes suficientes');
            let qt_vencedores = Number(result[0].qt_vencedores);
            if (result.length < qt_vencedores)
                return (0, response_1.default)(res).error(404, 'Não é possível realizar o sorteio pois não há participantes suficientes');
            var vencedores = [];
            while (qt_vencedores > vencedores.length) {
                let i = Math.floor(Math.random() * result.length);
                const vencedor = result.splice(i, 1);
                vencedores.push(vencedor[0]);
            }
            let insert = `UPDATE sorteio_participantes SET vencedor = 1 WHERE `;
            for (let z = 0; z < vencedores.length; z++)
                insert += ` id = ${vencedores[z].id} OR `;
            insert = insert.substring(0, insert.length - 3);
            conn.query(insert, err => {
                if (err)
                    return (0, response_1.default)(res).error(500, err);
                let listQ = "";
                for (let i = 0; i < vencedores.length; i++)
                    listQ += ` socios.id = ${vencedores[i].socio_id} OR `;
                listQ = listQ.substring(0, listQ.length - 3);
                let quryDevices = `
                    SELECT 
                          user_devices.code
                    FROM  socios 
                    JOIN  user         ON user.socio_id = socios.id 
                    JOIN  user_devices ON user.id = user_devices.user_id 
                    WHERE (${listQ}) AND NOT user_devices.code IS null
                `;
                conn.query(quryDevices, (err2, result2) => {
                    if (err2)
                        console.log(err2);
                    ;
                    let devices = [];
                    for (let i = 0; i < result2.length; i++)
                        devices.push(result2[i].code);
                    firebase_1.default.sendNotification(`PARABÉNS!`, "Você foi um dos ganhadores do sorteio! Confira!", devices);
                });
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
        if ((new Date(data_so.toString())).getTime() < (new Date(data_in.toString())).getTime())
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
        if ((new Date(data_so.toString())).getTime() < (new Date(data_in.toString())).getTime())
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