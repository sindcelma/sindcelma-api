"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mysqli_1 = __importDefault(require("./lib/mysqli"));
const config_1 = __importDefault(require("./lib/config"));
const routes_1 = __importDefault(require("./routes"));
const UserFactory_1 = require("./model/UserFactory");
const SocioManager_1 = __importDefault(require("./services/user/SocioManager"));
const auto_config_1 = __importDefault(require("./auto_config"));
const app = (0, express_1.default)();
const config = config_1.default.instance();
(0, mysqli_1.default)().query(`SELECT * FROM config WHERE id = 1`, (err, result) => {
    if (err)
        return;
    if (result.length == 0)
        return;
    config.setEmailReceiver(result[0].email_receiver);
    config.setEmailSystem(result[0].email_system);
});
const PORT = config.type() == "production" ? process.env.PORT || 80 : config.json().port;
const cors_options = {
    origin: "*"
};
(0, auto_config_1.default)();
app.use((0, cors_1.default)(cors_options));
app.use(express_1.default.static((0, path_1.join)(__dirname, 'public')));
app.use(express_1.default.json());
// inserir rotas publicas aqui
app.get('/socio_verify/:token', SocioManager_1.default.verify_by_qrcode_token);
app.use('/', UserFactory_1.middleware);
(0, routes_1.default)(app);
app.listen(PORT, () => {
    console.log(`API ativa na porta ${PORT}`);
});
//# sourceMappingURL=server.js.map