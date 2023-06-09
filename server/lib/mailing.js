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
const jwt_1 = require("./jwt");
const mysqli_1 = __importDefault(require("./mysqli"));
const _salvar_email = (conn, mailing, callback) => {
    let tentar = 0;
    let socio = mailing.isSocio ? 1 : 0;
    let hash = (0, jwt_1.generateSlug)(mailing.nome + mailing.email + tentar);
    conn.query("INSERT INTO mailing VALUES (0, ?, ?, ?, ?, ?)", [hash, mailing.nome, mailing.email, socio, mailing.status], (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (!err) {
            /*
            let resp = await new aws().ses().config({
                de:'atendimento@sindcelmatecnologia.com.br',
                para:mailing.email,
                assunto:'testando'
            }).send()
            console.log(resp.$response.error)
            */
            callback(true);
        }
        else
            callback(false);
    }));
};
const salvar_email = (nome, email, isSocio, callback) => {
    let conn = (0, mysqli_1.default)();
    conn.query("SELECT email, ativo FROM mailing WHERE email = ?", [email], (err, result) => {
        if (err)
            return callback(false);
        let maillingObj = {
            nome: nome,
            email: email,
            isSocio: isSocio,
            status: 1
        };
        if (result.length == 0) {
            return _salvar_email(conn, maillingObj, callback);
        }
        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            if (element.email == email) {
                if (element.ativo != 1)
                    conn.query("UPDATE mailing SET ativo = 1 WHERE email = ?", [email]);
                return callback(true);
            }
        }
        _salvar_email(conn, maillingObj, callback);
    });
};
const get_mailing = (status, isSocio) => {
    // retorna a lista de emails conforme as variaveis enviadas
};
const update_email = (email, status) => {
    // altera o status do email
};
exports.default = {
    salvar_email,
    get_mailing,
    update_email
};
//# sourceMappingURL=mailing.js.map