"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const config_1 = __importDefault(require("./config"));
//const URL = "http://192.168.0.11:3050";
exports.default = (res) => {
    return {
        success: (message = "") => {
            let resp = { message: message };
            if (res.user != null)
                resp.session = res.user.getSession();
            res.json(resp);
        },
        error: (code = 404, message = "") => res.status(code).json({ message: message }).end(),
        html: (path, vars = {}, code = 200) => {
            var html = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, `../html/${path}.html`)).toString();
            const ks = Object.keys(vars);
            for (let i = 0; i < ks.length; i++) {
                const key = ks[i];
                const val = vars[key];
                const reg = new RegExp(`\\$${key}`, 'g');
                html = html.replace(reg, val);
            }
            html = html.replace(/\$url/g, config_1.default.instance().json().url);
            res.setHeader("Content-Type", "text/html");
            res.status(code).send(html);
        }
    };
};
//# sourceMappingURL=response.js.map