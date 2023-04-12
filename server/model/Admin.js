"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./User"));
class Admin extends User_1.default {
    constructor(user) {
        super("Admin", user);
        this.slug = "";
        this.nome = "";
        this.master = false;
        this.access = [];
    }
    setMaster(num) {
        this.master = num == 1;
    }
    setAccess(access) {
        this.access = access;
    }
    setSlug(slug) {
        this.slug = slug;
    }
    getSlug() {
        return this.slug;
    }
    setNome(nome) {
        this.nome = nome;
    }
    getNome() {
        return this.nome;
    }
    hasAccess(service_slug) {
        return this.access.includes(service_slug);
    }
    isMaster() {
        return this.master;
    }
}
exports.default = Admin;
//# sourceMappingURL=Admin.js.map