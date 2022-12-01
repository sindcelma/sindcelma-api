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
        const dataAdmissao = data.data_admissao.toString();
        const dataNascimento = data.data_nascimento.toString();
        this.data_admissao = (0, data_1.dateFormat)(new Date(dataAdmissao), 'dd/MM/yyyy');
        this.data_en = (0, data_1.dateFormat)(new Date(dataAdmissao), 'yyyy-MM-dd');
        this.data_nascimento = (0, data_1.dateFormat)(new Date(dataNascimento), 'dd/MM/yyyy');
        this.data_nascimento_en = (0, data_1.dateFormat)(new Date(dataNascimento), 'yyyy-MM-dd');
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