"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysqli_1 = __importDefault(require("../../lib/mysqli"));
const response_1 = __importDefault(require("../../lib/response"));
class ComunicadosService {
    static list_active(req, res) {
        (0, mysqli_1.default)().query(`
            SELECT * FROM comunicados
            WHERE expire >= now() AND status = 1
            ORDER BY id DESC 
        `, (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            return (0, response_1.default)(res).success(result);
        });
    }
    static get_last_active(req, res) {
        (0, mysqli_1.default)().query(`
            SELECT * FROM comunicados
            WHERE expire >= now() AND status = 1
            ORDER BY id DESC LIMIT 1
        `, (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            return (0, response_1.default)(res).success(result);
        });
    }
}
exports.default = ComunicadosService;
//# sourceMappingURL=ComunicadosService.js.map