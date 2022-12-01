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
const fs_1 = require("fs");
const path_1 = require("path");
class SocioManager {
    static get_dados_profissionais(req, res) {
        const slug = req.body.slug;
        const empresa_id = req.body.empresa_id;
        if (!slug || !empresa_id)
            return (0, response_1.default)(res).error(400, 'bad request');
        var assert = (0, assertion_1.default)();
        try {
            assert =
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
                empresas.nome as nome_empresa,
                socios_dados_profissionais.cargo,
                socios_dados_profissionais.data_admissao,
                socios_dados_profissionais.num_matricula,
                user.temp_key
            FROM
                socios_dados_profissionais
            JOIN socios ON socios_dados_profissionais.socio_id = socios.id 
            JOIN user ON user.socio_id = socios.id
            JOIN empresas ON socios_dados_profissionais.empresa_id = empresas.id 
            WHERE socios.slug = ? AND socios_dados_profissionais.empresa_id = ?
        `, [slug, empresa_id], (err1, result) => {
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
                 socios.cpf,
                 socios_dados_pessoais.rg,
                 socios_dados_pessoais.sexo,
                 socios_dados_pessoais.data_nascimento,
                 socios_dados_pessoais.telefone,
                 socios_dados_pessoais.estado_civil,
                 user.temp_key
            FROM 
                 socios_dados_pessoais
            JOIN socios ON socios.id = socios_dados_pessoais.socio_id
            JOIN user   ON user.socio_id = socios.id 
            WHERE socios.slug = ?
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
            (0, response_1.default)(res).success(result[0]);
        });
    }
    /**
     * TESTADO
     * informações basicas
     */
    static update_dados_socio(req, res) {
        // nao pode alterar cpf
        const nome = req.body.nome;
        const sobrenome = req.body.sobrenome;
        const slug = req.body.slug;
        var assert = (0, assertion_1.default)();
        try {
            assert =
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
    /**
     *  TESTADO
     * informações profissionais
     */
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
                   socios_dados_profissionais.id,
                   user.temp_key
             FROM  socios_dados_profissionais
             JOIN  socios ON socios.id = socios_dados_profissionais.socio_id
             JOIN  user ON user.socio_id = socios.id 
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
        });
    }
    /**
     * TESTADO
     */
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
                   socios_dados_pessoais.id ,
                   user.temp_key
            FROM   socios_dados_pessoais
            JOIN   socios ON socios.id = socios_dados_pessoais.socio_id
            JOIN   user ON user.socio_id = socios.id
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
                if (err2) {
                    return (0, response_1.default)(res).error(500, err2);
                }
                (0, response_1.default)(res).success();
            });
        });
    }
    /**
     * TESTADO
     */
    static update_email(req, res) {
        // alterar email
        let slug = req.body.slug;
        let email = req.body.email;
        if (!slug || !email) {
            return (0, response_1.default)(res).error(400, 'bad request');
        }
        let user = req.user;
        var assert = (0, assertion_1.default)();
        try {
            assert =
                (0, assertion_1.default)()
                    .isAdmin(user)
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
            conn.query("UPDATE user SET email = ? WHERE id = ?", [email, result[0].id], err2 => {
                if (err2) {
                    return (0, response_1.default)(res).error(500, 'Este email já está cadastrado');
                }
                try {
                    const newF = `../../../public/images/fav/${email}.jpg`;
                    const oldF = `../../../public/images/fav/${result[0].email}.jpg`;
                    const fileN = (0, path_1.join)(__dirname, newF);
                    const fileO = (0, path_1.join)(__dirname, oldF);
                    (0, fs_1.renameSync)(fileO, fileN);
                }
                catch (error) {
                    console.log(error);
                }
                conn.query("DELETE FROM user_devices WHERE user_id = ?", [result[0].id]);
                conn.query("UPDATE user SET version = version+1 WHERE id = ?", [result[0].id]);
                (0, response_1.default)(res).success();
            });
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
                conn.query("SELECT salt, nome, sobrenome FROM socios WHERE slug = ?", [objDataUser.slug], (err, result) => __awaiter(this, void 0, void 0, function* () {
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
                    (0, response_1.default)(res).html('socio_view', {
                        nome: socio.nome + " " + socio.sobrenome
                    });
                }));
            }
            catch (error) {
                return (0, response_1.default)(res).error(400, 'bad request');
            }
        });
    }
    static check_status(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = (0, mysqli_1.default)();
            conn.query(`
            SELECT 
                  socios.id,
                  socios.status
            FROM  socios
            JOIN  user ON user.socio_id 
            WHERE user.id = ?
        `, [req.user.getId()], (err, result) => {
                if (err)
                    return (0, response_1.default)(res).error(500, 'Internal Error 1');
                if (result.length == 0)
                    return (0, response_1.default)(res).error();
                if (result[0].status == 1) {
                    const socio_id = result[0].id;
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
    static cadastrar_full_socio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresa_id = 1;
            const nome = req.body.nome;
            const sobrenome = req.body.sobrenome;
            const cpf = Socio_1.default.transformCpf(req.body.cpf);
            const email = req.body.email;
            const senha = yield (0, jwt_1.hashPass)(req.body.senha);
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
            conn.query(`
            INSERT INTO socios (nome, sobrenome, cpf, slug, salt, status)
            VALUES (?,?,?,?,?,0)
        `, [nome, sobrenome, cpf, slug, salt], (err, result) => {
                if (err) {
                    return (0, response_1.default)(res).error(500, "Já existe um sócio cadastrado com este documento");
                }
                const socio_id = result.insertId;
                conn.query(`
                INSERT INTO user (email, senha, socio_id) VALUES (?,?,?)
            `, [email, senha, socio_id], (err, result2) => {
                    const user_id = result2.insertId;
                    if (err) {
                        return (0, response_1.default)(res).error(500, 'Este e-mail já está cadastrado');
                    }
                    conn.query(`
                    INSERT INTO socios_dados_profissionais
                    (empresa_id, socio_id, cargo, data_admissao, num_matricula)
                    VALUES (?,?,?,?,?)
                `, [empresa_id, socio_id, cargo, admissao, '']);
                    conn.query(`
                    INSERT INTO socios_dados_pessoais
                    (socio_id, rg, sexo, estado_civil, data_nascimento, telefone)
                    VALUES (?,?,?,?,?,?)
                `, [socio_id, rg, sexo, civil, nascimento, telefone], err2 => {
                        if (err2) {
                            return (0, response_1.default)(res).error(500, err2.message);
                        }
                        conn.query("UPDATE socios SET status = 1 WHERE id = ?", [socio_id], (err4) => {
                            if (err4) {
                                return (0, response_1.default)(res).error(500, err4.message);
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
                return (0, response_1.default)(res).error(401, 'Unauthorized');
            }
            else {
                conn.query("DELETE FROM socios WHERE id = ?", [data.id], () => { });
                return (0, response_1.default)(res).success();
            }
        });
    }
    static get_socio_by_login(req, res) {
        let email = req.body.email;
        let doc = Socio_1.default.transformCpf(req.body.doc);
        if (!email && !doc) {
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
        let email = req.body.email;
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
                .isAdmin(user)
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
                .isAdmin(req.user)
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
            more += ' AND cpf = ? ';
            vars.push(scpf);
        }
        const conn = (0, mysqli_1.default)();
        vars.push(pagina, limite);
        const q = `
            SELECT
                socios.nome,
                socios.sobrenome,
                socios.slug,
                socios.cpf 
            FROM socios
            WHERE status = ?
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
                .isAdmin(req.user)
                .assert();
        }
        catch (error) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        const status = parseInt(req.body.status);
        const conn = (0, mysqli_1.default)();
        conn.query(`
            UPDATE socios SET status = ? WHERE slug = ?
        `, [status, req.body.slug], err => {
            if (err)
                return (0, response_1.default)(res).error(500, 'Internal Error');
            (0, response_1.default)(res).success();
        });
    }
}
exports.default = SocioManager;
//# sourceMappingURL=SocioManager.js.map