"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
class Config {
    constructor() {
        let res = (0, fs_1.readFileSync)(`${process.cwd()}/config.json`);
        const type = JSON.parse(res.toString()).type;
        this.typeinstance = type;
        let dat = (0, fs_1.readFileSync)(`${process.cwd()}/database.${type}.json`);
        this.database = JSON.parse(dat.toString());
        let con = (0, fs_1.readFileSync)(`${process.cwd()}/config.${type}.json`);
        this.values = JSON.parse(con.toString());
    }
    static instance() {
        if (Config.config == null) {
            Config.config = new Config();
        }
        return Config.config;
    }
    json() {
        return this.values;
    }
    getDatabase() {
        return this.database;
    }
    type() {
        return this.typeinstance;
    }
}
exports.default = Config;
//# sourceMappingURL=config.js.map