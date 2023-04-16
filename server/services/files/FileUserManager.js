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
const response_1 = __importDefault(require("../../lib/response"));
const assertion_1 = __importDefault(require("../../lib/assertion"));
const config_1 = __importDefault(require("../../lib/config"));
const jimp_1 = __importDefault(require("jimp"));
class FileUserManager {
    static create_ghost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, assertion_1.default)()
                    .isSocio(req.user)
                    .assert();
            }
            catch (e) {
                return (0, response_1.default)(res).error(401, 'Unauthorized');
            }
            const ext = req.body.ext;
            const dir = req.body.type == null || req.body.type == 'fav' ? "nodoc" : req.body.type;
            if (!ext)
                return (0, response_1.default)(res).error(400, 'Bad Request');
            const urlAssets = config_1.default.instance().json().asset;
            try {
                const resp = yield fetch(urlAssets + '/api/admin_file/create', {
                    method: 'POST',
                    body: JSON.stringify({
                        pair: config_1.default.instance().getPair(),
                        ext: ext,
                        dir: 'images/' + dir,
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
                    .isSocio(req.user)
                    .assert();
            }
            catch (e) {
                return (0, response_1.default)(res).error(401, 'Unauthorized');
            }
            const data = req.body.data;
            const slug = req.body.slug;
            const ext = req.body.ext;
            const dir = req.body.dir == null || req.body.dir == 'fav' ? "nodoc" : req.body.dir;
            if (!slug || !ext || !dir) {
                return (0, response_1.default)(res).error(400, 'Bad Request');
            }
            const urlAssets = config_1.default.instance().json().asset;
            try {
                const resp = yield fetch(urlAssets + '/api/admin_file/append', {
                    method: 'POST',
                    body: JSON.stringify({
                        pair: config_1.default.instance().getPair(),
                        ext: ext,
                        dir: 'images/' + dir,
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
                    .isSocio(req.user)
                    .assert();
            }
            catch (e) {
                return (0, response_1.default)(res).error(401, 'Unauthorized');
            }
            const slug = req.body.slug;
            const ext = req.body.ext;
            const dir = req.body.dir == null || req.body.dir == 'fav' ? "nodoc" : req.body.dir;
            console.log(dir);
            if (!slug || !ext || !dir) {
                return (0, response_1.default)(res).error(400, 'Bad Request');
            }
            const urlAssets = config_1.default.instance().json().asset;
            try {
                const resp1 = yield fetch(urlAssets + '/api/admin_file/commit', {
                    method: 'POST',
                    body: JSON.stringify({
                        pair: config_1.default.instance().getPair(),
                        ext: ext,
                        dir: 'images/' + dir,
                        to: dir == 'nodoc' ? 'images/fav/' : '',
                        copy: dir == 'nodoc' ? req.user.getEmail() : '',
                        slug: slug
                    })
                });
                const body = yield resp1.json();
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
    static __save_fav_jpg(path, to) {
        jimp_1.default.read(path)
            .then(file => {
            return file
                .quality(60) // set JPEG quality
                .write(to); // save
        })
            .catch(err => {
            console.error(err);
        });
    }
}
exports.default = FileUserManager;
//# sourceMappingURL=FileUserManager.js.map