"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
class Config {
    constructor() {
        let res = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, `../../config.json`));
        const type = JSON.parse(res.toString()).type;
        this.typeinstance = type;
        let dat = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, `../../database.${type}.json`));
        this.database = JSON.parse(dat.toString());
        let con = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, `../../config.${type}.json`));
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
Config.path = process.env.PATH || process.cwd();
exports.default = Config;
//# sourceMappingURL=config.js.map