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
const config_1 = __importDefault(require("./lib/config"));
const fs_1 = require("fs");
const jwt_1 = require("./lib/jwt");
const mysqli_1 = __importDefault(require("./lib/mysqli"));
const path_1 = require("path");
const config = config_1.default.instance();
function setAdminMaster() {
    return __awaiter(this, void 0, void 0, function* () {
        let adminBuff = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, `../admin.${config.type()}.json`));
        let admin = JSON.parse(adminBuff.toString());
        let pass = yield (0, jwt_1.hashPass)(admin.pass);
        try {
            let conn = (0, mysqli_1.default)();
            conn.query("INSERT INTO user (email, senha) VALUES (?,?)", [admin.login, pass], (err, result) => {
                if (err) {
                    console.log(err);
                    return false;
                }
                let lastId = result.insertId;
                conn.query("INSERT INTO admin (nome, user_id, slug, master) VALUES ('Master', ?, 'admin-master', 1)", [lastId], err => {
                    if (err) {
                        return false;
                    }
                    return true;
                });
            });
        }
        catch (e) {
            console.log(e);
            return false;
        }
    });
}
const setup = `{
    "type":"${config.type()}",
    "config":true
}`;
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        if (config.hasConfig()) {
            return;
        }
        yield setAdminMaster();
        try {
            (0, fs_1.writeFileSync)((0, path_1.join)(__dirname, `../config.json`), setup);
        }
        catch (e) {
            console.log(e);
        }
    });
}
exports.default = init;
//# sourceMappingURL=auto_config.js.map