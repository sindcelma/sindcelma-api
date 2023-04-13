"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const UserFactory_1 = require("./model/UserFactory");
const SocioManager_1 = __importDefault(require("./services/user/SocioManager"));
exports.default = (port) => {
    const app = (0, express_1.default)();
    const cors_options = {
        origin: "*"
    };
    app.use((0, cors_1.default)(cors_options));
    app.use(express_1.default.static((0, path_1.join)(__dirname, 'public')));
    app.use(express_1.default.json());
    // inserir rotas publicas aqui
    app.get('/socio_verify/:token', SocioManager_1.default.verify_by_qrcode_token);
    app.use('/', UserFactory_1.middleware);
    (0, routes_1.default)(app);
    app.listen(port, () => {
        console.log(`API ativa na porta ${port}`);
    });
};
//# sourceMappingURL=app.js.map