"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
class Config {
    constructor() {
        this.email_system = "";
        this.email_receiver = "";
        let res = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, `../../config.json`));
        const conf = JSON.parse(res.toString());
        this.typeinstance = conf.type;
        this.configurate = conf.config;
        this.config_data = conf;
        let confd = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, `../../app_info.json`));
        const config_d = JSON.parse(confd.toString());
        this.config_data = {
            app_version: config_d.app_version,
            api_version: config_d.api_version,
            wp_noticias: config_d.wp_noticias,
            package: config_d.package,
            packages: config_d.packages
        };
        let dat = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, `../../database.${this.typeinstance}.json`));
        this.database = JSON.parse(dat.toString());
        let con = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, `../../config.${this.typeinstance}.json`));
        this.values = JSON.parse(con.toString());
        let aws = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, `../../awsconfig.json`));
        this.awsconfig = JSON.parse(aws.toString());
        let pair = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, `../../pair_${this.typeinstance}.txt`));
        this.pair = pair.toString();
    }
    static instance() {
        if (Config.config == null) {
            Config.config = new Config();
        }
        return Config.config;
    }
    setEmailReceiver(email) {
        this.email_receiver = email;
    }
    getEmailReceiver() {
        return this.email_receiver;
    }
    setEmailSystem(email) {
        this.email_system = email;
    }
    getEmailSystem() {
        return this.email_system;
    }
    info() {
        return this.config_data;
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
    hasConfig() {
        return this.configurate;
    }
    getPair() {
        return this.pair;
    }
    aws() {
        return this.awsconfig;
    }
}
Config.path = process.env.PATH || process.cwd();
exports.default = Config;
//# sourceMappingURL=config.js.map