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
const node_fetch_1 = __importDefault(require("node-fetch"));
const assertion_1 = __importDefault(require("../../lib/assertion"));
const response_1 = __importDefault(require("../../lib/response"));
const config_1 = __importDefault(require("../../lib/config"));
class FileAdminManager {
    static generateCSV(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, assertion_1.default)()
                    .isAdmin(req.user)
                    .assert();
            }
            catch (e) {
                return (0, response_1.default)(res).error(401, 'Unauthorized');
            }
            if (!req.body.data || req.body.data.lenght < 2)
                return (0, response_1.default)(res).error(400, 'Bad Request');
            const urlAssets = config_1.default.instance().json().asset;
            try {
                let vars = [];
                vars.push(Object.keys(req.body.data[0]));
                for (let i = 0; i < req.body.data.length; i++) {
                    const obj = req.body.data[i];
                    vars.push(Object.values(obj));
                }
                const resp = yield (0, node_fetch_1.default)(urlAssets + '/api/generator_file/csv', {
                    method: 'POST',
                    body: JSON.stringify({
                        pair: config_1.default.instance().getPair(),
                        vars: vars,
                        name: req.body.name
                    })
                });
                const body = yield resp.json();
                if (body.code != 200) {
                    return (0, response_1.default)(res).error(body.code, body.message);
                }
                (0, response_1.default)(res).success({
                    file: urlAssets + '/file/' + body.message
                });
            }
            catch (error) {
                (0, response_1.default)(res).error(500, 'Erro ao tentar gerar o arquivo');
            }
        });
    }
    static create_ghost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, assertion_1.default)()
                    .isAdmin(req.user)
                    .assert();
            }
            catch (e) {
                return (0, response_1.default)(res).error(401, 'Unauthorized');
            }
            const ext = req.body.ext;
            const dir = req.body.dir;
            if (!ext || !dir)
                return (0, response_1.default)(res).error(400, 'Bad Request');
            const urlAssets = config_1.default.instance().json().asset;
            try {
                const resp = yield (0, node_fetch_1.default)(urlAssets + '/api/admin_file/create', {
                    method: 'POST',
                    body: JSON.stringify({
                        pair: config_1.default.instance().getPair(),
                        ext: ext,
                        dir: dir,
                        salt: req.user.getId()
                    })
                });
                const body = yield resp.json();
                if (body.code != 200) {
                    return (0, response_1.default)(res).error(body.code, body.message);
                }
                (0, response_1.default)(res).success({
                    slug: body.message.slug
                });
            }
            catch (e) {
                (0, response_1.default)(res).error(500, e);
            }
        });
    }
    static append(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, assertion_1.default)()
                    .isAdmin(req.user)
                    .assert();
            }
            catch (e) {
                return (0, response_1.default)(res).error(401, 'Unauthorized');
            }
            const data = req.body.data;
            const slug = req.body.slug;
            const ext = req.body.ext;
            const dir = req.body.dir;
            if (!slug || !ext || !dir) {
                return (0, response_1.default)(res).error(400, 'Bad Request');
            }
            const urlAssets = config_1.default.instance().json().asset;
            try {
                const resp = yield (0, node_fetch_1.default)(urlAssets + '/api/admin_file/append', {
                    method: 'POST',
                    body: JSON.stringify({
                        pair: config_1.default.instance().getPair(),
                        ext: ext,
                        dir: dir,
                        data: data,
                        slug: slug
                    })
                });
                const body = yield resp.json();
                if (body.code != 200) {
                    return (0, response_1.default)(res).error(body.code, body.message);
                }
                (0, response_1.default)(res).success();
            }
            catch (e) {
                (0, response_1.default)(res).error(500, e);
            }
        });
    }
    static commit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, assertion_1.default)()
                    .isAdmin(req.user)
                    .assert();
            }
            catch (e) {
                return (0, response_1.default)(res).error(401, 'Unauthorized');
            }
            const slug = req.body.slug;
            const ext = req.body.ext;
            const dir = req.body.dir;
            if (!slug || !ext || !dir) {
                return (0, response_1.default)(res).error(400, 'Bad Request');
            }
            const urlAssets = config_1.default.instance().json().asset;
            try {
                const resp = yield (0, node_fetch_1.default)(urlAssets + '/api/admin_file/commit', {
                    method: 'POST',
                    body: JSON.stringify({
                        pair: config_1.default.instance().getPair(),
                        ext: ext,
                        dir: dir,
                        slug: slug
                    })
                });
                const body = yield resp.json();
                if (body.code != 200) {
                    return (0, response_1.default)(res).error(body.code, body.message);
                }
                (0, response_1.default)(res).success(body.message);
            }
            catch (e) {
                (0, response_1.default)(res).error(500, e);
            }
        });
    }
}
exports.default = FileAdminManager;
//# sourceMappingURL=FileAdminManager.js.map