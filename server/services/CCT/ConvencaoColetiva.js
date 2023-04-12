"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysqli_1 = __importDefault(require("../../lib/mysqli"));
const response_1 = __importDefault(require("../../lib/response"));
const assertion_1 = __importDefault(require("../../lib/assertion"));
class ConvencaoColetiva {
    static save_fav(req, res) {
        const item_id = req.body.item_id;
        if (!item_id)
            return (0, response_1.default)(res).error(400, 'bad request');
        try {
            (0, assertion_1.default)()
                .isSocio(req.user)
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const conn = (0, mysqli_1.default)();
        conn.query(`
          SELECT
                 socios.id
            FROM socios 
            JOIN user ON user.socio_id = socios.id 
           WHERE user.id = ?
        `, [req.user.getId()], (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, 'server error 1');
            if (result.length == 0)
                return (0, response_1.default)(res).error(404, 'socio nao encontrado');
            const socio_id = result[0].id;
            conn.query('SELECT id FROM cct_item_fav WHERE cct_item_id = ? AND socio_id = ?', [item_id, socio_id], (err2, result2) => {
                if (err2)
                    return (0, response_1.default)(res).error(500, 'server error 2');
                if (result2.length > 0) {
                    const id_fav = result2[0].id;
                    conn.query(`
                            DELETE FROM cct_item_fav WHERE id = ?
                        `, [id_fav], err3 => {
                        if (err3)
                            return (0, response_1.default)(res).error(500, 'Erro ao tentar salvar');
                        (0, response_1.default)(res).success();
                    });
                }
                else {
                    conn.query(`
                            INSERT INTO cct_item_fav (cct_item_id, socio_id)
                            VALUES (?,?)
                        `, [item_id, socio_id], err3 => {
                        if (err3)
                            return (0, response_1.default)(res).error(500, 'Erro ao tentar salvar');
                        (0, response_1.default)(res).success();
                    });
                }
            });
        });
    }
    static item_detail(req, res) {
        const item_id = req.body.item_id;
        if (!item_id)
            return (0, response_1.default)(res).error(400, 'bad request');
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user)
                .orIsSocio(req.user)
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const conn = (0, mysqli_1.default)();
        conn.query(`
            SELECT item, imagem, resumo, texto
              FROM cct_item
             WHERE id = ?
        `, [item_id], (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, 'server error');
            if (result.length == 0)
                return (0, response_1.default)(res).error(404, 'not found');
            conn.query(`INSERT INTO cct_stats (cct_item_id, data) VALUES (?,now())`, [item_id]);
            (0, response_1.default)(res).success(result);
        });
    }
    static list_itens_by_search(req, res) {
        const search = req.body.search;
        const cct_id = req.body.cct_id;
        if (!search || !cct_id)
            return (0, response_1.default)(res).error(400, 'bad request');
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user)
                .orIsSocio(req.user)
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        let q = `
              SELECT 
                      id, item, resumo, 0 as fav
                FROM  cct_item 
               WHERE 
                  (   item   LIKE ?
                  OR  resumo LIKE ?
                  OR  texto  LIKE ? )
                 AND  cct_id = ?
        `;
        (0, mysqli_1.default)().query(q, [`%${search}%`, `%${search}%`, `%${search}%`, cct_id], (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, 'server error');
            (0, response_1.default)(res).success(result);
        });
    }
    static itens_by_socio(req, res) {
        if (!req.body.cct_id || !req.body.slug)
            return (0, response_1.default)(res).error(400, 'bad request');
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user)
                .orIsSameSocio(req.user, req.body.slug)
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const conn = (0, mysqli_1.default)();
        conn.query(`
            SELECT 
                cct_item.id,
                cct_item.item,
                cct_item.resumo,
                !isnull(c.id) as fav
            FROM cct_item 
            LEFT JOIN (
                SELECT 
                    cct_item_fav.id, cct_item_fav.cct_item_id 
                FROM cct_item_fav 
                JOIN socios ON socios.id = cct_item_fav.socio_id
                WHERE socios.slug = ?
            ) c ON c.cct_item_id = cct_item.id 
            WHERE cct_id = ?
            ORDER BY 
                c.id DESC, cct_item.item ASC;
        `, [req.body.slug, Number(req.body.cct_id)], (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, 'server error');
            (0, response_1.default)(res).success(result);
        });
    }
    static get_last_cct(req, res) {
        const conn = (0, mysqli_1.default)();
        conn.query(`
            SELECT 
                id,
                titulo
            FROM  cct 
            WHERE publico = 1
            ORDER BY id DESC LIMIT 1
        `, (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            (0, response_1.default)(res).success(result);
        });
    }
    static list(req, res) {
        const conn = (0, mysqli_1.default)();
        conn.query(`
            SELECT 
                id,
                titulo
            FROM cct 
            WHERE publico = 1
        `, (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            (0, response_1.default)(res).success(result);
        });
    }
}
exports.default = ConvencaoColetiva;
//# sourceMappingURL=ConvencaoColetiva.js.map