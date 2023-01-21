"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assertion_1 = __importDefault(require("../../lib/assertion"));
const response_1 = __importDefault(require("../../lib/response"));
const fs_1 = require("fs");
const path_1 = require("path");
const jwt_1 = require("../../lib/jwt");
const config_1 = __importDefault(require("../../lib/config"));
class FileAdminManager {
    static create_ghost(req, res) {
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
        const slug = (0, jwt_1.generateSlug)(`${req.user.getId()}${Date()}`);
        const fileStr = `../../public/${dir}/${slug}.${ext}.ghost`;
        const file = (0, path_1.join)(__dirname, fileStr);
        try {
            (0, fs_1.writeFileSync)(file, "", {
                flag: 'w',
            });
            (0, response_1.default)(res).success({
                slug: slug
            });
        }
        catch (e) {
            (0, response_1.default)(res).error(500, e);
        }
    }
    static append(req, res) {
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
        try {
            const buff = Buffer.from(data, "base64");
            const fileStr = `../../public/${dir}/${slug}.${ext}.ghost`;
            const file = (0, path_1.join)(__dirname, fileStr);
            (0, fs_1.appendFileSync)(file, buff);
            (0, response_1.default)(res).success();
        }
        catch (e) {
            (0, response_1.default)(res).error(500, 'Este arquivo não existe ou os dados enviados estão incorretos');
        }
    }
    static commit(req, res) {
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
        const newF = `../../public/${dir}/${slug}.${ext}`;
        const oldF = `${newF}.ghost`;
        const fileN = (0, path_1.join)(__dirname, newF);
        const fileO = (0, path_1.join)(__dirname, oldF);
        try {
            (0, fs_1.renameSync)(fileO, fileN);
            const img = `${config_1.default.instance().json().url + dir}/${slug}.${ext}`;
            (0, response_1.default)(res).success(img);
        }
        catch (e) {
            (0, response_1.default)(res).error(404, 'Este arquivo não existe');
        }
    }
}
exports.default = FileAdminManager;
//# sourceMappingURL=FileAdminManager.js.map