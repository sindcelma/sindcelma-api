"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = __importDefault(require("../../lib/response"));
const mysqli_1 = __importDefault(require("../../lib/mysqli"));
class NoticiasService {
    static last(req, res) {
        (0, mysqli_1.default)().query(`
            SELECT 
                 id, titulo, data_created, subtitulo, imagem 
            FROM noticias 
            ORDER BY id DESC LIMIT 1`, [], (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            (0, response_1.default)(res).success(result);
        });
    }
    static list(req, res) {
        const page = req.params.page ? Number(req.params.page) : 1;
        let search = req.body.search;
        if (!page || page < 1)
            return (0, response_1.default)(res).error(400, 'Bad Request');
        const limit = `${(page - 1) * 10},10`;
        let ssearch = "";
        if (search) {
            search = `%${search}%`;
            ssearch += " WHERE titulo LIKE ? OR text LIKE ? ";
        }
        const busca = search ? [search, search] : [];
        (0, mysqli_1.default)().query(`
            SELECT 
                id, titulo, data_created, subtitulo, imagem 
            FROM noticias
            ${ssearch}
            ORDER BY id DESC LIMIT ${limit}`, busca, (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            (0, response_1.default)(res).success(result);
        });
    }
    static get(req, res) {
        const id = Number(req.params.id);
        if (!id)
            return (0, response_1.default)(res).error(400, 'Bad Request');
        (0, mysqli_1.default)().query(`
            SELECT 
                id, titulo, text, imagem, data_created, editado
            FROM noticias 
           WHERE id  = ? `, [id], (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, err);
            if (result.length == 0)
                return (0, response_1.default)(res).error(404, 'Not Found');
            (0, response_1.default)(res).success(result);
        });
    }
}
exports.default = NoticiasService;
//# sourceMappingURL=NoticiasService.js.map