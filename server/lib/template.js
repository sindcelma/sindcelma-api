"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const config_1 = __importDefault(require("./config"));
function genHtml(content, vars) {
    content = content.replace(/\$\{asset\}/gi, config_1.default.instance().json().asset);
    content = content.replace(/\$\{url\}/gi, config_1.default.instance().json().url);
    let keys = Object.keys(vars);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const res = `\\$\\{${key}\\}`;
        let reg = RegExp(res, 'gi');
        content = content.replace(reg, vars[key]);
    }
    return content;
}
class Template {
    constructor(file = '') {
        this.textContent = '';
        if (file != '')
            this.textContent = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, `../${file}`)).toString();
    }
    setTemplate(template) {
        this.textContent = template;
        return this;
    }
    content() {
        return this.textContent;
    }
    replace(vars = {}) {
        this.textContent = genHtml(this.textContent, vars);
        return this;
    }
}
exports.default = Template;
//# sourceMappingURL=template.js.map