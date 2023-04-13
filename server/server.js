"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysqli_1 = __importDefault(require("./lib/mysqli"));
const config_1 = __importDefault(require("./lib/config"));
const auto_config_1 = __importDefault(require("./auto_config"));
const app_1 = __importDefault(require("./app"));
const config = config_1.default.instance();
(0, mysqli_1.default)().query(`SELECT * FROM config WHERE id = 1`, (err, result) => {
    if (err)
        return;
    if (result.length == 0)
        return;
    config.setEmailReceiver(result[0].email_receiver);
    config.setEmailSystem(result[0].email_system);
});
(0, auto_config_1.default)();
const isInProduction = config.type() == "production";
// http em desenvolvimento
(0, app_1.default)(isInProduction ? 80 : config.json().port);
if (isInProduction) // https
    (0, app_1.default)(443);
//# sourceMappingURL=server.js.map