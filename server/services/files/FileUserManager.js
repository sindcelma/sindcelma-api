"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysqli_1 = __importDefault(require("../../lib/mysqli"));
const jwt_1 = require("../../lib/jwt");
const fs_1 = require("fs");
const path_1 = require("path");
const response_1 = __importDefault(require("../../lib/response"));
const jimp_1 = __importDefault(require("jimp"));
class FileUserManager {
    static create_ghost(req, res) {
        const user_id = req.user.getId();
        const ext = req.body.ext;
        const type = req.body.type != null ? req.body.type : "fav";
        if (!ext || !type)
            return (0, response_1.default)(res).error(400, 'Bad Request');
        const slug = (0, jwt_1.generateSlug)(`${user_id}${Date()}`) + `_${type}`;
        const conn = (0, mysqli_1.default)();
        conn.query("INSERT INTO user_images (user_id, slug, type, ext) VALUES (?,?,?,?)", [user_id, slug, type, ext], err => {
            if (err)
                return (0, response_1.default)(res).error(500, err.message);
            const fileStr = `../../public/images/${type}/${slug}.${ext}.ghost`;
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
        });
    }
    static append(req, res) {
        const user_id = req.user.getId();
        const data = req.body.data;
        const slug = req.body.slug;
        if (!data || !slug)
            return (0, response_1.default)(res).error(400, 'Bad Request');
        const conn = (0, mysqli_1.default)();
        conn.query("SELECT ext, user_id, type FROM user_images WHERE slug = ? AND ativo = 0", [slug], (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, 'Internal Error');
            if (result.length == 0)
                return (0, response_1.default)(res).error();
            const fileSel = result[0];
            if (fileSel.user_id != user_id)
                return (0, response_1.default)(res).error(401, 'Unauthorized');
            const buff = Buffer.from(data, "base64");
            const fileStr = `../../public/images/${fileSel.type}/${slug}.${fileSel.ext}.ghost`;
            const file = (0, path_1.join)(__dirname, fileStr);
            try {
                (0, fs_1.appendFileSync)(file, buff);
                (0, response_1.default)(res).success();
            }
            catch (e) {
                (0, response_1.default)(res).error(500, 'Este arquivo não existe');
            }
        });
    }
    static commit(req, res) {
        const user_id = req.user.getId();
        const email = req.user.getEmail();
        const slug = req.body.slug;
        if (!slug)
            return (0, response_1.default)(res).error(400, 'Bad Request');
        const conn = (0, mysqli_1.default)();
        conn.query("SELECT ext, user_id, type FROM user_images WHERE slug = ? AND ativo = 0", [slug], (err, result) => {
            if (err)
                return (0, response_1.default)(res).error(500, 'Internal Error 1');
            if (result.length == 0)
                return (0, response_1.default)(res).error();
            const fileSel = result[0];
            if (fileSel.user_id != user_id)
                return (0, response_1.default)(res).error(401, 'Unauthorized');
            const newF = `../../public/images/${fileSel.type}/${slug}.${fileSel.ext}`;
            const oldF = `${newF}.ghost`;
            const fileN = (0, path_1.join)(__dirname, newF);
            const fileO = (0, path_1.join)(__dirname, oldF);
            try {
                (0, fs_1.renameSync)(fileO, fileN);
                if (fileSel.type == 'nodoc' || fileSel.type == 'fav') {
                    let fileFav = `../../public/images/fav/${email}.${fileSel.ext}`;
                    const copy = (0, path_1.join)(__dirname, fileFav);
                    (0, fs_1.copyFileSync)(fileN, copy);
                    if (fileSel.ext != "jpg") {
                        let to = `../../public/images/fav/${email}.jpg`;
                        FileUserManager.__save_fav_jpg(copy, to);
                    }
                }
                conn.query("UPDATE user_images SET ativo = 1 WHERE slug = ?", [slug], err => {
                    if (err)
                        return (0, response_1.default)(res).error(500, 'Internal Error 1');
                    (0, response_1.default)(res).success();
                });
            }
            catch (e) {
                (0, response_1.default)(res).error(404, 'Este arquivo não existe');
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