"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = __importDefault(require("../../lib/response"));
const mysqli_1 = __importDefault(require("../../lib/mysqli"));
class ConveniosService {
    static list(req, res) {
        (0, mysqli_1.default)().query("SELECT id, titulo, imagem FROM convenios", (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            (0, response_1.default)(res).success(result);
        });
    }
    static selected(req, res) {
        const id = req.body.id;
        if (!id)
            (0, response_1.default)(res).error(400, 'Bad Request');
        (0, mysqli_1.default)().query("SELECT titulo, imagem, descricao FROM convenios WHERE id = ?", [id], (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            (0, response_1.default)(res).success(result);
        });
    }
}
exports.default = ConveniosService;
//# sourceMappingURL=ConveniosService.js.map