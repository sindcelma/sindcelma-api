"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./lib/config"));
const routes_1 = __importDefault(require("./routes"));
const UserFactory_1 = require("./model/UserFactory");
const SocioManager_1 = __importDefault(require("./services/user/SocioManager"));
const app = (0, express_1.default)();
const config = config_1.default.instance();
const PORT = config.type() == "production" ? process.env.PORT : config.json().port;
app.use(express_1.default.static('public'));
app.use(express_1.default.json());
// inserir rotas publicas aqui
app.get('/socio_verify/:token', SocioManager_1.default.verify_by_qrcode_token);
app.use('/', UserFactory_1.middleware);
(0, routes_1.default)(app);
app.listen(PORT, () => {
    console.log(`API ativa na porta ${PORT}`);
});
//# sourceMappingURL=server.js.map