"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_1 = __importDefault(require("../../lib/aws"));
const response_1 = __importDefault(require("../../lib/response"));
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
class EmailTest {
    static sendEmail(req, res) {
        new aws_1.default().ses()
            .config({
            de: "atendimento@sindcelmatecnologia.com.br",
            para: "andreifcoelho@gmail.com",
            assunto: "Recuperação de senha",
            data: {
                nome: "Andrei",
                codigo: "09f38"
            }
        })
            .setTemplate(fs_1.default.readFileSync((0, path_1.join)(__dirname, '../../html/recover.html')).toString())
            .send();
        (0, response_1.default)(res).success();
    }
}
exports.default = EmailTest;
//# sourceMappingURL=EmailTest.js.map