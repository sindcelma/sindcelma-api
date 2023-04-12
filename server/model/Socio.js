"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./User"));
const data_1 = require("../lib/data");
class Socio extends User_1.default {
    constructor(user) {
        super("Socio", user);
        this.nome = "";
        this.sobrenome = "";
        this.slug = "";
        this.status = 0;
        this.salt = "";
        this.sexo = "";
        this.estado_civil = "";
        this.telefone = "";
        this.cargo = "";
        this.num_matricula = "";
        this.empresa = "";
        this.data_nascimento = "";
        this.data_nascimento_en = "";
        this.data_admissao = "";
        this.data_en = "";
    }
    setOthersDatas(data) {
        this.data_admissao = data.data_admissao != null ? (0, data_1.dateFormat)(new Date(data.data_admissao.toString()), 'dd/MM/yyyy') : null;
        this.data_en = data.data_admissao != null ? (0, data_1.dateFormat)(new Date(data.data_admissao.toString()), 'yyyy-MM-dd') : null;
        this.data_nascimento = data.data_nascimento != null ? (0, data_1.dateFormat)(new Date(data.data_nascimento.toString()), 'dd/MM/yyyy') : null;
        this.data_nascimento_en = data.data_nascimento != null ? (0, data_1.dateFormat)(new Date(data.data_nascimento.toString()), 'yyyy-MM-dd') : null;
        this.salt = data.salt;
        this.sexo = data.sexo;
        this.estado_civil = data.estado_civil;
        this.telefone = data.telefone;
        this.cargo = data.cargo;
        this.num_matricula = data.num_matricula;
        this.empresa = data.nome_empresa;
    }
    setFullName(nome, sobrenome) {
        this.nome = nome;
        this.sobrenome = sobrenome;
    }
    setSlug(slug) {
        this.slug = slug;
    }
    setStatus(status) {
        this.status = status;
    }
    getSlug() {
        return this.slug;
    }
    static transformCpf(cpf) {
        cpf = cpf.trim();
        const match = /(\d{2,3})\.?(\d{3})\.?(\d{3})-?(\d{2})$/.exec(cpf);
        if (match == null) {
            return false;
        }
        return match[1] + "." + match[2] + "." + match[3] + "-" + match[4];
    }
}
exports.default = Socio;
//# sourceMappingURL=Socio.js.map