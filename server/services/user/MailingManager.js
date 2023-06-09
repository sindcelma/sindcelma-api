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
const mailing_1 = __importDefault(require("../../lib/mailing"));
const response_1 = __importDefault(require("../../lib/response"));
class MailingManager {
    static salvar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(f => setTimeout(f, 1000));
            mailing_1.default.salvar_email(req.body.nome, req.body.email, false, s => {
                if (!s)
                    return (0, response_1.default)(res).error(500, 'Erro ao tentar salvar');
                (0, response_1.default)(res).success();
            });
        });
    }
}
exports.default = MailingManager;
//# sourceMappingURL=MailingManager.js.map