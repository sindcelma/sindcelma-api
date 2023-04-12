"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysqli_1 = __importDefault(require("../../lib/mysqli"));
const response_1 = __importDefault(require("../../lib/response"));
const assertion_1 = __importDefault(require("../../lib/assertion"));
const data_1 = require("../../lib/data");
class SorteioService {
    static inscreverSe(req, res) {
        if (!req.body.sorteio_id)
            return (0, response_1.default)(res).error(400, 'bad request');
        try {
            (0, assertion_1.default)()
                .isSocio(req.user)
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const sorteio_id = Number(req.body.sorteio_id);
        const socio = req.user;
        const conn = (0, mysqli_1.default)();
        conn.query(`
            SELECT 
                    sorteio_participantes.id      as participante_id,
                    socios.id                     as socio_id,
                    socios_dados_pessoais.id      as dados_pessoais_id,
                    socios_dados_profissionais.id as dados_profissionais_id,
                    socios.diretor
            FROM        socios
            LEFT JOIN   socios_dados_pessoais      ON socios_dados_pessoais.socio_id = socios.id
            LEFT JOIN   socios_dados_profissionais ON socios_dados_profissionais.socio_id = socios.id
            LEFT JOIN   sorteio_participantes 
                   ON   sorteio_participantes.socio_id   = socios.id
                  AND   sorteio_participantes.sorteio_id = ?
            WHERE socios.slug = ?
        `, [sorteio_id, socio.getSlug()], (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            if (result.length == 0)
                return (0, response_1.default)(res).error(404, 'socio not found');
            if (result[0].diretor == 1)
                return (0, response_1.default)(res).error(400, 'Diretores não podem ser inscritos em sorteios');
            const socio_id = result[0].socio_id;
            const partc_id = result[0].participante_id;
            const pesso_id = result[0].dados_pessoais_id;
            const proff_id = result[0].dados_profissionais_id;
            if (pesso_id == null || proff_id == null)
                return (0, response_1.default)(res).error(405, 'Você precisa cadastrar todas as suas informações para participar do sorteio.');
            if (partc_id != null)
                return (0, response_1.default)(res).error(403, 'Sócio já está inscrito');
            conn.query(`
                INSERT INTO sorteio_participantes (sorteio_id, socio_id)
                VALUES (?,?)
            `, [sorteio_id, socio_id], err4 => {
                if (err4)
                    return (0, response_1.default)(res).error(500, err4);
                (0, response_1.default)(res).success();
            });
        });
    }
    static get_vencedores(req, res) {
        if (!req.params.sorteio_id)
            return (0, response_1.default)(res).error(400, 'bad request');
        const conn = (0, mysqli_1.default)();
        conn.query(`
          SELECT 
                    socios.id as socio_id,
                    socios.slug,
                    socios.nome,
                    socios.sobrenome,
                    sorteio_participantes.vencedor

             FROM   sorteio_participantes
             JOIN   socios ON sorteio_participantes.socio_id = socios.id
             JOIN   sorteios ON sorteios.id = sorteio_participantes.sorteio_id
            WHERE   sorteios.id = ? AND sorteio_participantes.vencedor = 1
        `, [Number(req.params.sorteio_id)], (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            if (result.length == 0)
                return (0, response_1.default)(res).error(404, 'not found');
            (0, response_1.default)(res).success(result);
        });
    }
    static get_participantes(req, res) {
        if (!req.params.sorteio_id)
            return (0, response_1.default)(res).error(400, 'bad request');
        const conn = (0, mysqli_1.default)();
        conn.query(`
          SELECT 
                    socios.nome,
                    socios.sobrenome,
                    sorteio_participantes.vencedor

             FROM   sorteio_participantes
             JOIN   socios ON sorteio_participantes.socio_id = socios.id
             JOIN   sorteios ON sorteios.id = sorteio_participantes.sorteio_id
            WHERE   sorteios.id = ? AND socios.ghost = 0
        `, [Number(req.params.sorteio_id)], (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            if (result.length == 0)
                return (0, response_1.default)(res).error(404, 'not found');
            (0, response_1.default)(res).success(result);
        });
    }
    static list(req, res) {
        const conn = (0, mysqli_1.default)();
        conn.query(`
            SELECT 
                sorteios.id as sorteio_id,
                sorteios.titulo,
                sorteios.premios,
                sorteios.qt_vencedores,
                sorteios.data_sorteio,
                sorteios.ativo,
                sp.status_sorteio
            FROM   sorteios
            LEFT JOIN(
                SELECT 
                    sorteio_participantes.sorteio_id,
                    (CASE 
                        WHEN sorteio_participantes.id IS NULL THEN 0
                        WHEN sorteio_participantes.vencedor > 0 THEN 2
                        ELSE 1
                    END)  as status_sorteio
                FROM   sorteio_participantes 
                JOIN   socios ON sorteio_participantes.socio_id = socios.id  
                JOIN   user   ON user.socio_id = socios.id
                WHERE  user.id = ?
                
            ) as sp ON sp.sorteio_id = sorteios.id 
            WHERE sorteios.ativo > 0
            ORDER BY 
                sorteios.id DESC,
                (
                    CASE 
                        WHEN sorteios.ativo = 1
                            THEN sorteios.data_sorteio
                    END
                ) ASC,
                (
                    CASE 
                        WHEN sorteios.ativo = 2
                            THEN sorteios.data_sorteio
                    END
                ) DESC

            ;

        `, [req.user.getId()], (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            if (result.length == 0)
                return (0, response_1.default)(res).success([]);
            const sorteios = [];
            for (let i = 0; i < result.length; i++) {
                const data = (0, data_1.dateFormat)(new Date(result[i].data_sorteio), 'yyyy-MM-dd H:i:s');
                const sorteio = result[i];
                sorteio.data = data;
                sorteio.inscrito = result[i].status_sorteio != null && result[i].status_sorteio > 0;
                sorteio.vencedor = result[i].status_sorteio != null && result[i].status_sorteio == 2;
                sorteios.push(sorteio);
            }
            (0, response_1.default)(res).success(sorteios);
        });
    }
    static get_sorteio(req, res) {
        if (!req.params.sorteio_id)
            return (0, response_1.default)(res).error(400, 'bad request');
        const conn = (0, mysqli_1.default)();
        conn.query(`
          SELECT 
                    sorteios.ativo,
                    sorteios.id,
                    sorteios.titulo,
                    sorteios.premios,
                    sorteios.qt_vencedores,
                    sorteios.data_sorteio,
                    sorteios.data_inscricao

             FROM   sorteios 
            WHERE   id = ?

        `, [Number(req.params.sorteio_id)], (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            if (result.length == 0)
                return (0, response_1.default)(res).error(404, 'not found');
            const data = (0, data_1.dateFormat)(new Date(result[0].data_sorteio), 'yyyy-MM-dd H:i:s');
            const data_inp = (0, data_1.dateFormat)(new Date(result[0].data_sorteio), 'yyyy-MM-dd');
            const data_insc = (0, data_1.dateFormat)(new Date(result[0].data_inscricao), 'yyyy-MM-dd');
            result[0]['data'] = data;
            result[0]['data_br'] = data_inp;
            result[0]['data_insc'] = data_insc;
            (0, response_1.default)(res).success(result);
        });
    }
    static get_last(req, res) {
        const conn = (0, mysqli_1.default)();
        conn.query(`
          SELECT 
                    sorteios.id,
                    sorteios.titulo,
                    sorteios.premios,
                    sorteios.qt_vencedores,
                    sorteios.data_sorteio

             FROM   sorteios 
            WHERE   ativo = 1
         ORDER BY   id DESC LIMIT 1

        `, (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            if (result.length == 0)
                return (0, response_1.default)(res).success([]);
            const data = (0, data_1.dateFormat)(new Date(result[0].data_sorteio), 'yyyy-MM-dd H:i:s');
            result[0]['data'] = data;
            (0, response_1.default)(res).success(result[0]);
        });
    }
    static get_last_ativo_by_user(req, res) {
        const conn = (0, mysqli_1.default)();
        conn.query(`
          SELECT 
                    sorteios.id,
                    sorteios.titulo,
                    sorteios.premios,
                    sorteios.qt_vencedores,
                    sorteios.data_sorteio

             FROM   sorteios 
            WHERE   ativo = 1
         ORDER BY   id DESC LIMIT 1

        `, (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            if (result.length == 0)
                return (0, response_1.default)(res).success([]);
            const data = (0, data_1.dateFormat)(new Date(result[0].data_sorteio), 'yyyy-MM-dd H:i:s');
            const sorteio = result[0];
            sorteio.data = data;
            sorteio.inscrito = false;
            sorteio.vencedor = false;
            conn.query(`
              SELECT 
                       sorteio_participantes.id,
                       sorteio_participantes.vencedor

                FROM   sorteios
                JOIN   sorteio_participantes ON sorteio_participantes.sorteio_id = sorteios.id
                JOIN   socios ON sorteio_participantes.socio_id = socios.id  
                JOIN   user   ON user.socio_id = socios.id
              
               WHERE   user.id = ?
                 AND   sorteios.id = ?
            `, [req.user.getId(), sorteio.id], (err2, result2) => {
                if (err2)
                    return (0, response_1.default)(res).error(500, err2);
                if (result2.length == 0)
                    return (0, response_1.default)(res).success(sorteio);
                sorteio.vencedor = result2[0].vencedor == 1;
                sorteio.inscrito = result2[0].id != null;
                (0, response_1.default)(res).success(sorteio);
            });
        });
    }
}
exports.default = SorteioService;
//# sourceMappingURL=SorteioService.js.map