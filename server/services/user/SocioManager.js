"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assertion_1 = __importDefault(require("../../lib/assertion"));
const jwt_1 = require("../../lib/jwt");
const mysqli_1 = __importDefault(require("../../lib/mysqli"));
const response_1 = __importDefault(require("../../lib/response"));
const Socio_1 = __importDefault(require("../../model/Socio"));
const crypto_1 = __importDefault(require("crypto"));
const data_1 = require("../../lib/data");
const node_fetch_1 = __importDefault(require("node-fetch"));
const firebase_1 = __importDefault(require("../../lib/firebase"));
const aws_1 = __importDefault(require("../../lib/aws"));
const config_1 = __importDefault(require("../../lib/config"));
const jwt_2 = require("../../lib/jwt");
class SocioManager {
    static cancelar_inscricao(req, res) {
        let pass = req.body.pass;
        if (!req.body.key || !pass) {
            return (0, response_1.default)(res).error(400, 'bad request');
        }
        let user = req.user;
        const conn = (0, mysqli_1.default)();
        conn.query(`
            SELECT temp_key, senha, socio_id
            FROM   user
            WHERE  id = ?
        `, [user.getId()], (err1, result) => __awaiter(this, void 0, void 0, function* () {
            if (err1) {
                return (0, response_1.default)(res).error(500, err1);
            }
            if (result.length == 0) {
                return (0, response_1.default)(res).error(404, 'Not Found');
            }
            if (req.body.key != result[0].temp_key) {
                return (0, response_1.default)(res).error(403, 'need refresh key');
            }
            if (!(yield (0, jwt_2.comparePass)(pass, result[0].senha))) {
                return (0, response_1.default)(res).error(402, 'senha incorreta');
            }
            conn.query("DELETE FROM socios WHERE id = ?", [result[0].socio_id], (err2) => {
                if (err2) {
                    return (0, response_1.default)(res).error(500, err2);
                }
                (0, response_1.default)(res).success();
            });
        }));
    }
    static ghosts(req, res) {
        try {
            (0, assertion_1.default)()
                .isMaster(req.user)
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        (0, mysqli_1.default)().query(`
            SELECT
                socios.id,
                socios.nome,
                socios.sobrenome,
                socios.slug,
                socios.cpf,
                socios.np,
                socios.status
            FROM socios
            WHERE ghost = 1
            ORDER BY id ASC
        `, (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            (0, response_1.default)(res).success(result);
        });
    }
    static set_ghost(req, res) {
        try {
            (0, assertion_1.default)()
                .isMaster(req.user)
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const isGhost = parseInt(req.body.isGhost);
        const socio_id = parseInt(req.body.socio_id);
        if (![0, 1].includes(isGhost))
            return (0, response_1.default)(res).error(400, 'bad request');
        (0, mysqli_1.default)().query(`
            UPDATE socios SET ghost = ? WHERE id = ?
        `, [isGhost, socio_id], err => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            (0, response_1.default)(res).success();
        });
    }
    static set_diretor(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user, 'socios')
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const diretor = parseInt(req.body.diretor);
        const socio_id = parseInt(req.body.socio_id);
        if (![0, 1].includes(diretor))
            return (0, response_1.default)(res).error(400, 'bad request');
        (0, mysqli_1.default)().query(`
            UPDATE socios SET diretor = ? WHERE id = ?
        `, [diretor, socio_id], err => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            (0, response_1.default)(res).success();
        });
    }
    static save_image(req, res) {
        const slug = req.body.slug;
        const link = req.body.link;
        const type = req.body.type;
        if (!slug || !link || !type)
            return (0, response_1.default)(res).error(400, 'bad request');
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user, 'socios')
                .orIsSameSocio(req.user, slug)
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        (0, mysqli_1.default)().query(`
            INSERT INTO 
            user_images (user_id, slug, type, ext, ativo)
            VALUES (?,?,?,?,?)
        `, [req.user.getId(), link, type, '', 1], err => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            return (0, response_1.default)(res).success();
        });
    }
    static get_doc_carteirinha(req, res) {
        const slug = req.body.slug;
        if (!slug)
            return (0, response_1.default)(res).error(400, 'bad request');
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user, 'socios')
                .orIsSameSocio(req.user, slug)
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const conn = (0, mysqli_1.default)();
        conn.query("SELECT cpf, status FROM socios WHERE slug = ?", [slug], (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            (0, response_1.default)(res).success(result);
        });
    }
    static update_doc_by_np(req, res) {
        const np = req.body.np;
        const cpf = Socio_1.default.transformCpf(req.body.cpf);
        if (!np || !cpf)
            return (0, response_1.default)(res).error(400, 'bad request');
        const conn = (0, mysqli_1.default)();
        conn.query(`
            SELECT 
                  cpf
            FROM  socios 
            WHERE np = ?
        `, [np], (err, result) => {
            if (err) {
                return (0, response_1.default)(res).error(500, "Este CPF já está cadastrado com outro usuário.");
            }
            if (result.length == 0) {
                return (0, response_1.default)(res).error(404, 'Not Found');
            }
            if (result[0].cpf != null) {
                return (0, response_1.default)(res).error(500, 'Seu CPF já está cadastrado');
            }
            conn.query("UPDATE socios SET cpf = ? WHERE np = ?", [cpf, np], err => {
                if (err)
                    return (0, response_1.default)(res).error(500, err);
                (0, response_1.default)(res).success();
            });
        });
    }
    static get_dados_profissionais(req, res) {
        const slug = req.body.slug;
        if (!slug)
            return (0, response_1.default)(res).error(400, 'bad request');
        var assert = (0, assertion_1.default)();
        try {
            assert =
                (0, assertion_1.default)()
                    .isAdmin(req.user, 'socios')
                    .orIsSameSocio(req.user, req.body.slug)
                    .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const conn = (0, mysqli_1.default)();
        conn.query(`
            SELECT 
                empresas.nome as nome_empresa,
                socios_dados_profissionais.cargo,
                socios_dados_profissionais.data_admissao,
                socios_dados_profissionais.num_matricula,
                user.temp_key
            
            FROM socios
                 JOIN user ON user.socio_id = socios.id
            LEFT JOIN socios_dados_profissionais 
                   ON socios_dados_profissionais.socio_id = socios.id 
            LEFT JOIN empresas ON socios_dados_profissionais.empresa_id = empresas.id 
            
            WHERE socios.slug = ? 
        `, [slug], (err1, result) => {
            if (err1) {
                return (0, response_1.default)(res).error(500, err1);
            }
            if (result.length == 0) {
                return (0, response_1.default)(res).error(404, 'Not Found');
            }
            if (assert.index != 0 && !req.body.key) {
                return (0, response_1.default)(res).error(400, 'bad request');
            }
            if (assert.index != 0 && req.body.key != result[0].temp_key) {
                return (0, response_1.default)(res).error(403, 'need refresh key');
            }
            (0, response_1.default)(res).success(result[0]);
        });
    }
    static get_dados_pessoais(req, res) {
        const slug = req.body.slug;
        if (!slug)
            return (0, response_1.default)(res).error(400, 'bad request');
        var assert = (0, assertion_1.default)();
        try {
            assert =
                (0, assertion_1.default)()
                    .isAdmin(req.user, 'socios')
                    .orIsSameSocio(req.user, slug)
                    .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const conn = (0, mysqli_1.default)();
        conn.query(`
            SELECT
                 socios.cpf,
                 socios_dados_pessoais.rg,
                 socios_dados_pessoais.sexo,
                 socios_dados_pessoais.data_nascimento,
                 socios_dados_pessoais.telefone,
                 socios_dados_pessoais.estado_civil,
                 user.temp_key
            FROM socios 
            JOIN user ON user.socio_id = socios.id 
            LEFT JOIN socios_dados_pessoais ON socios.id = socios_dados_pessoais.socio_id
            WHERE socios.slug = ?
        `, [slug], (err1, result) => {
            if (err1) {
                return (0, response_1.default)(res).error(500, err1);
            }
            if (result.length == 0) {
                return (0, response_1.default)(res).error(404, 'Not Found');
            }
            if (assert.index != 0 && !req.body.key) {
                return (0, response_1.default)(res).error(400, 'bad request');
            }
            if (assert.index != 0 && req.body.key != result[0].temp_key) {
                return (0, response_1.default)(res).error(403, 'need refresh key');
            }
            (0, response_1.default)(res).success(result[0]);
        });
    }
    static update_dados_socio(req, res) {
        // nao pode alterar cpf
        const nome = req.body.nome;
        const sobrenome = req.body.sobrenome;
        const slug = req.body.slug;
        var assert = (0, assertion_1.default)();
        try {
            assert =
                (0, assertion_1.default)()
                    .isAdmin(req.user, 'socios')
                    .orIsSameSocio(req.user, req.body.slug)
                    .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const conn = (0, mysqli_1.default)();
        conn.query(`
            SELECT user.id, user.temp_key
            FROM   user JOIN socios ON user.socio_id = socios.id 
            WHERE  socios.slug = ?
        `, [slug], (err1, result) => {
            if (err1) {
                return (0, response_1.default)(res).error(500, err1);
            }
            if (result.length == 0) {
                return (0, response_1.default)(res).error(404, 'Not Found');
            }
            if (!req.body.key) {
                return (0, response_1.default)(res).error(400, 'bad request');
            }
            if (assert.index != 0 && req.body.key != result[0].temp_key) {
                return (0, response_1.default)(res).error(403, 'need refresh key');
            }
            conn.query(`
                UPDATE socios SET nome = ? , sobrenome = ? WHERE slug = ?
            `, [nome, sobrenome, slug], err => {
                if (err) {
                    return (0, response_1.default)(res).error(500, 'Internal Error');
                }
                (0, response_1.default)(res).success();
            });
        });
    }
    static update_dados_profissionais(req, res) {
        const slug = req.body.slug;
        const empresa_id = req.body.empresa_id;
        const cargo = req.body.cargo;
        const data_admissao = req.body.data_admissao;
        const num_matricula = req.body.num_matricula;
        var assert = (0, assertion_1.default)();
        try {
            assert =
                (0, assertion_1.default)()
                    .isAdmin(req.user, 'socios')
                    .orIsSameSocio(req.user, req.body.slug)
                    .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const conn = (0, mysqli_1.default)();
        conn.query(`
            SELECT 
                   socios_dados_profissionais.id,
                   user.temp_key,
                   socios.id as socio_id
             FROM  socios
        LEFT JOIN  socios_dados_profissionais ON socios.id = socios_dados_profissionais.socio_id
             JOIN  user ON user.socio_id = socios.id 
            WHERE  socios.slug = ?
        `, [slug], (err1, result) => {
            if (err1) {
                return (0, response_1.default)(res).error(500, err1);
            }
            if (result.length == 0) {
                return (0, response_1.default)(res).error(404, 'Socio não encontrado');
            }
            if (!req.body.key) {
                return (0, response_1.default)(res).error(400, 'bad request');
            }
            if (assert.index != 0 && req.body.key != result[0].temp_key) {
                return (0, response_1.default)(res).error(403, 'need refresh key');
            }
            if (result[0].id == null) {
                conn.query(`
                    INSERT INTO socios_dados_profissionais (socio_id, empresa_id, cargo, data_admissao, num_matricula)
                    VALUES (?,?,?,?,?)
                `, [result[0].socio_id, empresa_id, cargo, data_admissao, num_matricula], err2 => {
                    if (err2)
                        return (0, response_1.default)(res).error(500, err2);
                    (0, response_1.default)(res).success();
                });
            }
            else {
                const id = result[0].id;
                conn.query(`
                    UPDATE socios_dados_profissionais 
                    SET    empresa_id = ?
                    ,      cargo = ? 
                    ,      data_admissao = ? 
                    ,      num_matricula = ?
                    WHERE  id = ?
                `, [empresa_id, cargo, data_admissao, num_matricula, id], err2 => {
                    if (err2) {
                        return (0, response_1.default)(res).error(500, 'Internal Error');
                    }
                    (0, response_1.default)(res).success();
                });
            }
        });
    }
    static update_dados_pessoais(req, res) {
        const slug = req.body.slug;
        const rg = req.body.rg;
        const sexo = req.body.sexo;
        const estado_civil = req.body.estado_civil;
        const data_nascimento = req.body.data_nascimento;
        const telefone = req.body.telefone;
        var assert = (0, assertion_1.default)();
        try {
            assert =
                (0, assertion_1.default)()
                    .isAdmin(req.user, 'socios')
                    .orIsSameSocio(req.user, req.body.slug)
                    .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const conn = (0, mysqli_1.default)();
        conn.query(`
            SELECT 
                   socios_dados_pessoais.id ,
                   user.temp_key,
                   socios.id as socio_id
            FROM   socios
       LEFT JOIN   socios_dados_pessoais ON socios.id = socios_dados_pessoais.socio_id
            JOIN   user ON user.socio_id = socios.id
            WHERE  socios.slug = ?
        `, [slug], (err1, result) => {
            if (err1) {
                return (0, response_1.default)(res).error(500, err1);
            }
            if (result.length == 0) {
                return (0, response_1.default)(res).error(404, 'Socio não encontrado');
            }
            if (!req.body.key) {
                return (0, response_1.default)(res).error(400, 'bad request');
            }
            if (assert.index != 0 && req.body.key != result[0].temp_key) {
                return (0, response_1.default)(res).error(403, 'need refresh key');
            }
            if (result[0].id == null) {
                conn.query(`
                    INSERT INTO socios_dados_pessoais (socio_id, rg, sexo, estado_civil, data_nascimento, telefone)
                    VALUES (?,?,?,?,?,?)
                `, [result[0].socio_id, rg, sexo, estado_civil, data_nascimento, telefone], err2 => {
                    if (err2)
                        return (0, response_1.default)(res).error(500, err2);
                    (0, response_1.default)(res).success();
                });
            }
            else {
                const id = result[0].id;
                conn.query(`
                    UPDATE socios_dados_pessoais 
                    SET    rg = ? 
                    ,      sexo = ? 
                    ,      estado_civil = ?
                    ,      data_nascimento = ?
                    ,      telefone = ?
                    WHERE  id = ?
                `, [rg, sexo, estado_civil, data_nascimento, telefone, id], err2 => {
                    if (err2)
                        return (0, response_1.default)(res).error(500, err2);
                    (0, response_1.default)(res).success();
                });
            }
        });
    }
    /**
     * TESTADO
     */
    static update_email(req, res) {
        // alterar email
        let slug = req.body.slug;
        let email = req.body.email ? req.body.email.trim() : null;
        if (!slug || !email) {
            return (0, response_1.default)(res).error(400, 'bad request');
        }
        let user = req.user;
        var assert = (0, assertion_1.default)();
        try {
            assert =
                (0, assertion_1.default)()
                    .isAdmin(user, 'socios')
                    .orIsSameSocio(user, slug)
                    .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const conn = (0, mysqli_1.default)();
        conn.query(`
            SELECT user.id, user.temp_key, user.email
            FROM   user JOIN socios ON user.socio_id = socios.id 
            WHERE  socios.slug = ?
        `, [slug], (err1, result) => {
            if (err1) {
                return (0, response_1.default)(res).error(500, err1);
            }
            if (result.length == 0) {
                return (0, response_1.default)(res).error(404, 'Not Found');
            }
            if (!req.body.key) {
                return (0, response_1.default)(res).error(400, 'bad request');
            }
            if (assert.index != 0 && req.body.key != result[0].temp_key) {
                return (0, response_1.default)(res).error(403, 'need refresh key');
            }
            conn.query("UPDATE user SET email = ? WHERE id = ?", [email, result[0].id], (err2) => __awaiter(this, void 0, void 0, function* () {
                if (err2)
                    return (0, response_1.default)(res).error(500, 'Este email já está cadastrado');
                try {
                    let obj = {
                        ext: `jpg`,
                        dir: `images/fav`,
                        old: result[0].email.trim(),
                        new: email.trim(),
                        pair: config_1.default.instance().getPair()
                    };
                    let reqq = yield (0, node_fetch_1.default)(`${config_1.default.instance().json().asset}/api/admin_file/change_name`, {
                        method: 'POST',
                        body: JSON.stringify(obj)
                    });
                    const body = yield reqq.text();
                    const resp = yield JSON.parse(body);
                    if (resp.code != 200)
                        return (0, response_1.default)(res).error(resp.code, resp.message);
                    conn.query("DELETE FROM user_devices WHERE user_id = ?", [result[0].id]);
                    conn.query("UPDATE user SET version = version+1 WHERE id = ?", [result[0].id]);
                    (0, response_1.default)(res).success();
                }
                catch (error) {
                    (0, response_1.default)(res).error(500, error);
                }
            }));
        });
    }
    static verify_by_qrcode_token(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.params.token)
                return (0, response_1.default)(res).error(400, 'bad request');
            const fulltoken = req.params.token;
            const partstoken = fulltoken.split('.');
            const datasender = Buffer.from(partstoken[0], 'base64').toString('utf-8');
            const strhash256 = partstoken[1];
            try {
                const objDataUser = JSON.parse(datasender);
                if (Date.now() > objDataUser.duration) {
                    return (0, response_1.default)(res).error(403, 'Forbiden - Link Expired');
                }
                const conn = (0, mysqli_1.default)();
                conn.query("SELECT salt, nome, sobrenome, status FROM socios WHERE slug = ?", [objDataUser.slug], (err, result) => __awaiter(this, void 0, void 0, function* () {
                    if (err)
                        return (0, response_1.default)(res).error(500, 'internal error');
                    if (result.length == 0)
                        return (0, response_1.default)(res).error();
                    const socio = result[0];
                    const salt = socio.salt;
                    const key = objDataUser.slug + salt + datasender;
                    const utf8 = new TextEncoder().encode(key);
                    const hashBuffer = crypto_1.default.createHash('sha256').update(utf8).digest('hex');
                    if (hashBuffer != strhash256) {
                        return (0, response_1.default)(res).error(401, 'Unauthorized');
                    }
                    let bg = "#72CF83";
                    let st = "ativo";
                    let tx = "white";
                    let code = 200;
                    switch (socio.status) {
                        case 2:
                            bg = "#FFA200";
                            st = "aguardando aprovação";
                            code = 403;
                            break;
                        case 3:
                            bg = "#72CF83";
                            st = "ativo";
                            tx = "success";
                            code = 200;
                            break;
                        case 4:
                            bg = "#c92e42";
                            st = "bloqueado";
                            code = 401;
                            break;
                        case 0:
                        case 1:
                        default:
                            bg = "#c92e42";
                            st = "inativo";
                            code = 404;
                            break;
                    }
                    (0, response_1.default)(res).html('socio_view', {
                        nome: socio.nome + " " + socio.sobrenome,
                        bg: bg,
                        status: st,
                        text: tx
                    }, code);
                }));
            }
            catch (error) {
                return (0, response_1.default)(res).error(403, 'Forbiden - Bad Link');
            }
        });
    }
    static check_status(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = (0, mysqli_1.default)();
            conn.query(`
            SELECT 
                  socios.id,
                  socios.status,
                  socios.nome
            FROM  socios
            JOIN  user ON user.socio_id = socios.id
            WHERE user.id = ?
        `, [req.user.getId()], (err, result) => {
                if (err)
                    return (0, response_1.default)(res).error(500, 'Internal Error 1');
                if (result.length == 0)
                    return (0, response_1.default)(res).error();
                if (result[0].status == 1) {
                    const socio_id = result[0].id;
                    const socio_nm = result[0].nome;
                    conn.query(`
                    SELECT 
                          id
                    FROM  user_images
                    WHERE type = ?
                `, ['doc'], (err, result) => {
                        if (err)
                            return (0, response_1.default)(res).error(500, 'Internal Error 2');
                        if (result.length == 0)
                            return (0, response_1.default)(res).error(401);
                        conn.query("UPDATE socios SET status = 2 WHERE id = ? ", [socio_id], err => {
                            if (err)
                                return (0, response_1.default)(res).error(500, 'Internal Error 3');
                            new aws_1.default().ses()
                                .config({
                                de: config_1.default.instance().getEmailSystem(),
                                para: config_1.default.instance().getEmailReceiver(),
                                assunto: `O Sócio ${socio_nm} aguarda aprovação`,
                                data: {}
                            })
                                .setContent(`
                            <h3>O Sócio ${socio_nm} enviou as imagens e aguarda sua aprovação para utilizar os serviços do aplicativo Sindcelma</h3>

                            <p><a href="http://adminsindcelma.com.br">Abra o sistema</a> clique em sócios e mude de 'sócios ativos' para 'novos sócios'.</p>
                        `)
                                .send();
                            (0, response_1.default)(res).success();
                        });
                    });
                }
                else {
                    (0, response_1.default)(res).success();
                }
            });
        });
    }
    static get_data(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.params.slug)
                return (0, response_1.default)(res).error(404, "Not Found");
            let slug = req.params.slug;
            (0, mysqli_1.default)().query(`select 
                    socios.nome as nome,
                    socios.sobrenome as sobrenome,
                    socios.cpf as cpf,
                    socios.np as np,
                    socios.status as status,
                    dados_pess.rg as rg,
                    dados_pess.sexo as genero,
                    dados_pess.estado_civil as estado_civil,
                    dados_pess.data_nascimento as data_nascimento,
                    dados_pess.telefone as telefone,
                    dados_prof.cargo as cargo,
                    dados_prof.data_admissao as data_admissao,
                    user.email as email
                from socios 
                    join user on user.socio_id = socios.id 
                    join socios_dados_profissionais as dados_prof on dados_prof.socio_id = socios.id 
                    join socios_dados_pessoais as dados_pess on dados_pess.socio_id = socios.id 
                where socios.slug = ? AND socios.status < 3;`, [slug], (err, result) => {
                if (err)
                    return (0, response_1.default)(res).error(500, 'Server Error');
                if (result.length == 0)
                    return (0, response_1.default)(res).error(404, "Not Found");
                let socio = result[0];
                if (socio.status > 2)
                    return (0, response_1.default)(res).error(404, "Not Found");
                socio.data_nascimento = (0, data_1.dateFormat)(new Date(socio.data_nascimento.toString()), "dd/MM/yyyy");
                socio.data_admissao = (0, data_1.dateFormat)(new Date(socio.data_admissao.toString()), "dd/MM/yyyy");
                (0, response_1.default)(res).success(socio);
            });
        });
    }
    static cadastrar_full_socio_web(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pass = req.body.senha.trim();
            if (pass == "")
                return (0, response_1.default)(res).error(400, 'Bad Request 1');
            const empresa_id = 1;
            const nome = req.body.nome;
            const sobrenome = req.body.sobrenome;
            const cpf = Socio_1.default.transformCpf(req.body.cpf);
            const email = req.body.email ? req.body.email.trim() : null;
            const senha = yield (0, jwt_1.hashPass)(pass);
            const rg = req.body.rg;
            const sexo = req.body.sexo[0];
            const civil = req.body.estado_civil;
            const nascimento = req.body.data_nascimento;
            const telefone = req.body.telefone;
            const cargo = req.body.cargo;
            const admissao = req.body.data_admissao;
            const np = req.body.np;
            if (!email || !cpf || !senha || !nome || !sobrenome || !rg || !sexo
                || !civil || !nascimento || !telefone || !cargo || !admissao || !np) {
                return (0, response_1.default)(res).error(400, 'Bad Request 1');
            }
            const conn = (0, mysqli_1.default)();
            const slug = (0, jwt_1.generateSlug)(cpf + String(new Date().getMilliseconds()) + String(Math.random()));
            const salt = (0, jwt_1.generateSlug)(slug + String(new Date().getMilliseconds()) + String(Math.random()));
            conn.query('SELECT id FROM user WHERE email = ?', [email], (err1, resultemail) => {
                if (err1)
                    return (0, response_1.default)(res).error(500, "Erro no banco de dados");
                if (resultemail.length > 0)
                    return (0, response_1.default)(res).error(400, 'Este e-mail já está em uso');
                conn.query(`
                INSERT INTO socios (nome, sobrenome, np, cpf, slug, salt, status)
                VALUES (?,?,?,?,?,?,0)
            `, [nome, sobrenome, np, cpf, slug, salt], (err2, result) => __awaiter(this, void 0, void 0, function* () {
                    if (err2)
                        return (0, response_1.default)(res).error(500, "Já existe um sócio cadastrado com este documento");
                    const socio_id = result.insertId;
                    try {
                        yield (0, node_fetch_1.default)(`${config_1.default.instance().json().asset}/api/server_file/add_random_fav`, {
                            method: 'POST',
                            body: JSON.stringify({
                                pair: config_1.default.instance().getPair(),
                                email: email
                            })
                        });
                    }
                    catch (error) {
                        console.log("nao conseguiu...");
                    }
                    conn.query(`
                    INSERT INTO user (email, senha, socio_id) VALUES (?,?,?)
                `, [email, senha, socio_id], (err3) => {
                        if (err3)
                            return (0, response_1.default)(res).error(400, 'Este e-mail já está em uso');
                        conn.query(`
                        INSERT INTO socios_dados_pessoais
                        (socio_id, rg, sexo, estado_civil, data_nascimento, telefone)
                        VALUES (?,?,?,?,?,?)
                    `, [socio_id, rg, sexo, civil, nascimento, telefone], err4 => {
                            if (err4)
                                return (0, response_1.default)(res).error(500, err4.message);
                            conn.query(`
                            INSERT INTO socios_dados_profissionais
                            (empresa_id, socio_id, cargo, data_admissao, num_matricula)
                            VALUES (?,?,?,?,?)
                        `, [empresa_id, socio_id, cargo, admissao, '']);
                            conn.query("UPDATE socios SET status = 2 WHERE id = ?", [socio_id], (err5) => {
                                if (err5) {
                                    return (0, response_1.default)(res).error(500, err5.message);
                                }
                                (0, response_1.default)(res).success({
                                    slug: slug
                                });
                            });
                        });
                    });
                }));
            });
        });
    }
    static cadastrar_full_socio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pass = req.body.senha.trim();
            if (pass == "")
                return (0, response_1.default)(res).error(400, 'Bad Request 1');
            const empresa_id = 1;
            const nome = req.body.nome;
            const sobrenome = req.body.sobrenome;
            const cpf = Socio_1.default.transformCpf(req.body.cpf);
            const email = req.body.email ? req.body.email.trim() : null;
            const senha = yield (0, jwt_1.hashPass)(pass);
            const rg = req.body.rg;
            const sexo = req.body.sexo[0];
            const civil = req.body.estado_civil;
            const nascimento = req.body.data_nascimento;
            const telefone = req.body.telefone;
            const cargo = req.body.cargo;
            const admissao = req.body.data_admissao;
            if (!email || !cpf || !senha || !nome || !sobrenome || !rg || !sexo
                || !civil || !nascimento || !telefone || !cargo || !admissao) {
                return (0, response_1.default)(res).error(400, 'Bad Request 1');
            }
            const conn = (0, mysqli_1.default)();
            const slug = (0, jwt_1.generateSlug)(cpf + String(new Date().getMilliseconds()) + String(Math.random()));
            const salt = (0, jwt_1.generateSlug)(slug + String(new Date().getMilliseconds()) + String(Math.random()));
            conn.query('SELECT id FROM user WHERE email = ?', [email], (err1, resultemail) => {
                if (err1)
                    return (0, response_1.default)(res).error(500, "Erro no banco de dados");
                if (resultemail.length > 0)
                    return (0, response_1.default)(res).error(400, 'Este e-mail já está em uso');
                conn.query(`
                INSERT INTO socios (nome, sobrenome, cpf, slug, salt, status)
                VALUES (?,?,?,?,?,0)
            `, [nome, sobrenome, cpf, slug, salt], (err2, result) => {
                    if (err2)
                        return (0, response_1.default)(res).error(500, "Já existe um sócio cadastrado com este documento");
                    const socio_id = result.insertId;
                    conn.query(`
                    INSERT INTO user (email, senha, socio_id) VALUES (?,?,?)
                `, [email, senha, socio_id], (err3) => {
                        if (err3)
                            return (0, response_1.default)(res).error(400, 'Este e-mail já está em uso');
                        conn.query(`
                        INSERT INTO socios_dados_pessoais
                        (socio_id, rg, sexo, estado_civil, data_nascimento, telefone)
                        VALUES (?,?,?,?,?,?)
                    `, [socio_id, rg, sexo, civil, nascimento, telefone], err4 => {
                            if (err4)
                                return (0, response_1.default)(res).error(500, err4.message);
                            conn.query(`
                            INSERT INTO socios_dados_profissionais
                            (empresa_id, socio_id, cargo, data_admissao, num_matricula)
                            VALUES (?,?,?,?,?)
                        `, [empresa_id, socio_id, cargo, admissao, '']);
                            conn.query("UPDATE socios SET status = 1 WHERE id = ?", [socio_id], (err5) => {
                                if (err5) {
                                    return (0, response_1.default)(res).error(500, err5.message);
                                }
                                (0, response_1.default)(res).success({
                                    cpf: cpf,
                                    slug: slug,
                                    salt: salt
                                });
                            });
                        });
                    });
                });
            });
        });
    }
    static check_document(req, res) {
        const conn = (0, mysqli_1.default)();
        let doc = req.body.doc;
        if (!doc) {
            return (0, response_1.default)(res).error(400, 'Bad Request');
        }
        const cpf = Socio_1.default.transformCpf(doc);
        conn.query(`SELECT 
                status,
                id
            FROM socios 
            WHERE
                cpf = ? `, [cpf], (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, 'Interal Error');
            if (result.length == 0) {
                return (0, response_1.default)(res).success();
            }
            let data = result[0];
            if (data.status > 0) {
                return (0, response_1.default)(res).error(400, 'Este documento já está em uso');
            }
            else {
                conn.query("DELETE FROM socios WHERE id = ?", [data.id], () => { });
                return (0, response_1.default)(res).success();
            }
        });
    }
    static get_socio_por_id(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user, 'socios')
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        let id = req.body.id;
        if (!id) {
            return (0, response_1.default)(res).error(400, 'Bad Request');
        }
        let conn = (0, mysqli_1.default)();
        conn.query(`SELECT 
                user.id,
                user.email,
                socios.nome,
                socios.sobrenome,
                socios.np,
                socios.cpf,
                socios.slug,
                socios.status,
                socios.ghost,
                socios.diretor
            FROM socios 
            LEFT JOIN user ON socios.id = user.socio_id 
            WHERE
                socios.id = ?`, [id], (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, 'Interal Error');
            if (result.length == 0)
                return (0, response_1.default)(res).error(404, 'Not Found');
            let data = result[0];
            if (data.id == null) {
                data['images'] = [];
                return (0, response_1.default)(res).success(data);
            }
            conn.query(`SELECT 
                        slug
                    FROM user_images
                WHERE (type = 'doc' OR type = 'nodoc')
                AND user_id = ?
            `, [data.id], (err, result) => {
                if (err)
                    return (0, response_1.default)(res).error(500, 'Interal Error 2');
                data['images'] = result;
                return (0, response_1.default)(res).success(data);
            });
        });
    }
    static get_socio_by_login(req, res) {
        let email = req.body.email ? req.body.email.trim() : null;
        let doc = Socio_1.default.transformCpf(req.body.doc);
        if (!email || !doc) {
            return (0, response_1.default)(res).error(400, 'Bad Request');
        }
        const conn = (0, mysqli_1.default)();
        if (doc) {
            conn.query(`SELECT 
                    user.id,
                    user.email,
                    socios.cpf,
                    socios.status
                FROM socios 
                LEFT JOIN user ON socios.user_id = user.id 
                WHERE
                    socios.cpf = ?`, [doc], (err, result) => {
                if (err)
                    return (0, response_1.default)(res).error(500, 'Interal Error');
                if (result.length == 0)
                    return (0, response_1.default)(res).error(404, 'Not Found');
                let data = result[0];
                if (data.status == 2)
                    return (0, response_1.default)(res).error(401, 'Unauthorized');
                if (data.id == null)
                    return (0, response_1.default)(res).success({ action: 'user' });
                return (0, response_1.default)(res).success({
                    action: 'pass',
                    email: data.email,
                    cpf: data.cpf
                });
            });
        }
        else {
            conn.query(`SELECT 
                    user.id,
                    user.email,
                    socios.cpf,
                    socios.status
                FROM user 
                JOIN socios ON socios.user_id = user.id 
                WHERE 
                    user.email = ?`, [email], (err, result) => {
                if (err)
                    return (0, response_1.default)(res).error(500, 'Interal Error');
                if (result.length == 0)
                    return (0, response_1.default)(res).error(404, 'Not Found');
                let data = result[0];
                if (data.status == 2)
                    return (0, response_1.default)(res).error(401, 'Unauthorized');
                return (0, response_1.default)(res).success({
                    action: 'pass',
                    email: data.email,
                    cpf: data.cpf
                });
            });
        }
    }
    static cadastrar_usuario(req, res) {
        // verificar se o cliente enviou o CPF, email, senha
        let email = req.body.email ? req.body.email.trim() : null;
        let doc = Socio_1.default.transformCpf(req.body.doc);
        let senha = req.body.senha;
        let news = req.body.news;
        if (!email || !doc || !senha) {
            return (0, response_1.default)(res).error(400, 'Bad Request');
        }
        const conn = (0, mysqli_1.default)();
        conn.query(`
            INSERT INTO user (email, senha, ativo) VALUES (?,?,1)
        `, [email, senha], (err, result) => {
            if (err) {
                return (0, response_1.default)(res).error(500, 'Este e-mail já está cadastrado');
            }
            const user_id = result.insertId;
            conn.query(`
                UPDATE socios SET user_id = ? WHERE cpf = ?
            `, [user_id, doc], err2 => {
                if (err2) {
                    return (0, response_1.default)(res).error(500, 'Erro Crítico - contate o admin');
                }
                if (news) {
                    conn.query(`
                        INSERT INTO mailing_socio (user_id, ativo) VALUES (?,1)
                    `, [user_id], () => { });
                }
                else {
                }
                (0, response_1.default)(res).success();
            });
        });
    }
    static delete_usuario(req, res) {
        let user_id = req.body.user_id;
        let user = req.user;
        try {
            (0, assertion_1.default)()
                .isAdmin(user, 'socios')
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const conn = (0, mysqli_1.default)();
        conn.query("DELETE FROM user WHERE id = ?", [user_id], err => {
            if (err) {
                return (0, response_1.default)(res).error(500, 'Server Error');
            }
            (0, response_1.default)(res).success();
        });
    }
    static cadastrar_socio(req, res) {
        // Nome, sobrenome, CPF
        const nome = req.body.nome;
        const sobrenome = req.body.sobrenome;
        const cpf = Socio_1.default.transformCpf(req.body.cpf);
        const conn = (0, mysqli_1.default)();
        const slug = (0, jwt_1.generateSlug)(cpf + String(new Date().getMilliseconds()) + String(Math.random()));
        const salt = (0, jwt_1.generateSlug)(slug + String(new Date().getMilliseconds()) + String(Math.random()));
        conn.query(`
            INSERT INTO socios (nome, sobrenome, cpf, slug, salt, status)
            VALUES (?,?,?,?,?,0)
        `, [nome, sobrenome, cpf, slug, salt], err => {
            if (err) {
                return (0, response_1.default)(res).error(500, "Já existe um sócio cadastrado com este documento");
            }
            (0, response_1.default)(res).success({
                slug: slug
            });
        });
    }
    static add_dados_profissionais(req, res) {
        //const empresa_id = req.body.empresa_id
        const empresa_id = 1;
        const slug = req.body.slug;
        const cargo = req.body.cargo;
        const admissao = req.body.data_admissao;
        //const matricula = req.body.num_matricula
        const conn = (0, mysqli_1.default)();
        conn.query(`
            SELECT socios.id 
            FROM socios 
            WHERE slug = ?
            AND status = 0
        `, [slug], (err1, result) => {
            if (err1) {
                return (0, response_1.default)(res).error(500, 'Internal Error');
            }
            if (result.length == 0) {
                return (0, response_1.default)(res).error(404, 'Not Found');
            }
            const socio_id = result[0].id;
            conn.query(`
                INSERT INTO socios_dados_profissionais
                (empresa_id, socio_id, cargo, data_admissao, num_matricula)
                VALUES (?,?,?,?,?)
            `, [empresa_id, socio_id, cargo, admissao, ''], err2 => {
                if (err2) {
                    return (0, response_1.default)(res).error(501, 'Já existem dados profissionais cadastrados neste socio');
                }
                (0, response_1.default)(res).success();
            });
        });
    }
    static add_dados_pessoais(req, res) {
        const slug = req.body.slug;
        const rg = req.body.rg;
        const sexo = req.body.sexo;
        const estado_civil = req.body.estado_civil;
        const data_nascimento = req.body.data_nascimento;
        const telefone = req.body.telefone;
        const conn = (0, mysqli_1.default)();
        conn.query(`
            SELECT socios.id 
            FROM socios 
            WHERE slug = ?
            AND status = 0
        `, [slug], (err1, result) => {
            if (err1) {
                return (0, response_1.default)(res).error(500, 'Internal Error');
            }
            if (result.length == 0) {
                return (0, response_1.default)(res).error(404, 'Not Found');
            }
            const socio_id = result[0].id;
            conn.query(`
                INSERT INTO socios_dados_pessoais
                (socio_id, rg, sexo, estado_civil, data_nascimento, telefone)
                VALUES (?,?,?,?,?,?)
            `, [socio_id, rg, sexo, estado_civil, data_nascimento, telefone], err2 => {
                if (err2) {
                    return (0, response_1.default)(res).error(500, 'Internal Error');
                }
                conn.query("UPDATE socios SET status = 1 WHERE id = ?", [socio_id], (err3) => {
                    if (err3) {
                        return (0, response_1.default)(res).error(500, 'Internal Error');
                    }
                    (0, response_1.default)(res).success();
                });
            });
        });
    }
    static listar(req, res) {
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user, 'socios')
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const limite = parseInt(req.body.limite);
        const pagina = (parseInt(req.body.pagina) - 1) * limite;
        const status = parseInt(req.body.status);
        // opcionais
        const snome = req.body.nome;
        const ssobr = req.body.sobrenome;
        const scpf = req.body.cpf;
        const snp = req.body.np;
        let more = ' ';
        let vars = [];
        vars.push(status);
        if (snome) {
            more += ' AND nome LIKE ? ';
            vars.push(`%${snome}%`);
        }
        if (ssobr) {
            more += ' AND sobrenome LIKE ? ';
            vars.push(`%${ssobr}%`);
        }
        if (scpf) {
            more += ' AND cpf LIKE ? ';
            vars.push(`%${scpf}%`);
        }
        if (snp) {
            more += ' AND np = ? ';
            vars.push(snp);
        }
        const conn = (0, mysqli_1.default)();
        vars.push(pagina, limite);
        const q = `
            SELECT
                socios.id,
                socios.nome,
                socios.sobrenome,
                socios.slug,
                socios.cpf,
                socios.np
            FROM socios
            WHERE status = ? AND ghost = 0
            ${more}
            ORDER BY id ASC LIMIT ?,?; 
        `;
        conn.query(q, vars, (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(400, 'Bad Request');
            (0, response_1.default)(res).success(result);
        });
    }
    static mudar_status(req, res) {
        /**
         * nao existe      = 0
         * falta usuario   = 1
         * em aprovação    = 2
         * aprovado        = 3
         * bloqueado       = 4
         */
        try {
            (0, assertion_1.default)()
                .isAdmin(req.user, 'socios')
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const status = parseInt(req.body.status);
        const conn = (0, mysqli_1.default)();
        const aprovado = status == 3;
        conn.query(`
            UPDATE socios SET status = ? ${aprovado ? ', data_filiacao = now()' : ''} WHERE slug = ?
        `, [status, req.body.slug], err => {
            if (err)
                return (0, response_1.default)(res).error(500, 'Internal Error');
            if (aprovado) {
                conn.query(`
                    SELECT 
                          socios.nome,
                          user_devices.code
                    FROM  socios 
                     JOIN user         ON user.socio_id = socios.id 
                     JOIN user_devices ON user.id = user_devices.user_id 
                    WHERE socios.slug = ? AND NOT user_devices.code IS null
                    ORDER BY user_devices.id DESC LIMIT 1
                `, [req.body.slug], (err2, result) => {
                    if (err2)
                        return;
                    const nome = result[0].nome;
                    let devices = [];
                    for (let i = 0; i < result.length; i++)
                        devices.push(result[i].code);
                    firebase_1.default.sendNotification(`Parabéns ${nome}!`, "Você está ativo e pode aproveitar todos os serviços do APP", devices);
                });
            }
            (0, response_1.default)(res).success();
        });
    }
}
exports.default = SocioManager;
//# sourceMappingURL=SocioManager.js.map