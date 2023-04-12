"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = __importDefault(require("./services/CCT/routes"));
const routes_2 = __importDefault(require("./services/user/routes"));
const routes_3 = __importDefault(require("./services/tests/routes"));
const routes_4 = __importDefault(require("./services/files/routes"));
const routes_5 = __importDefault(require("./services/sorteio/routes"));
const routes_6 = __importDefault(require("./services/noticias/routes"));
const routes_7 = __importDefault(require("./services/comunicados/routes"));
const routes_8 = __importDefault(require("./services/convenios/routes"));
const Info_1 = __importDefault(require("./services/Info"));
exports.default = (app) => {
    app.get('/info', Info_1.default.info);
    app.use('/sorteios', (0, routes_5.default)());
    app.use('/test', (0, routes_3.default)());
    app.use('/cct', (0, routes_1.default)());
    app.use('/user', (0, routes_2.default)());
    app.use('/files', (0, routes_4.default)());
    app.use('/noticias', (0, routes_6.default)());
    app.use('/comunicados', (0, routes_7.default)());
    app.use('/convenios', (0, routes_8.default)());
    app.use('/', (req, res) => res.send("BAD REQUEST"));
};
//# sourceMappingURL=routes.js.map