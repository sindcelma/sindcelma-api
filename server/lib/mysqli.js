"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const mysql_1 = require("mysql");
const database = config_1.default.instance().getDatabase();
const mysqli = (0, mysql_1.createConnection)({
    host: database.host,
    user: database.user,
    password: database.pass,
    port: database.port,
    database: database.name
});
mysqli.connect();
exports.default = () => mysqli;
//# sourceMappingURL=mysqli.js.map