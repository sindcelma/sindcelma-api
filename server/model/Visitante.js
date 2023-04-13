"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./User"));
class Visitante extends User_1.default {
    constructor() {
        const visitante = {
            id: 0,
            email: '',
            version: 0
        };
        super("Visitante", visitante);
    }
}
exports.default = Visitante;
//# sourceMappingURL=Visitante.js.map