"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const template_1 = __importDefault(require("./template"));
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
            const html = new template_1.default(`html/${path}.html`).replace(vars).content();
            res.setHeader("Content-Type", "text/html");
            res.status(code).send(html);
        }
    };
};
//# sourceMappingURL=response.js.map