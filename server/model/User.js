"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const config_1 = __importDefault(require("../lib/config"));
class User {
    constructor(type, user) {
        this.id = 0;
        this.sess = "";
        this.agent = "";
        this.version = 0;
        this.email = "";
        this.type = type;
        this.id = user.id;
        this.email = user.email;
        this.version = user.version;
    }
    getId() {
        return this.id;
    }
    getVersion() {
        return this.version;
    }
    getEmail() {
        return this.email;
    }
    getType() {
        return this.type;
    }
    getSession() {
        return this.sess;
    }
    getAgent() {
        return this.agent;
    }
    setSession(sess) {
        this.sess = sess;
    }
    setAgent(agent) {
        if (agent)
            this.agent = agent;
    }
    getRememberMeToken() {
        const config = config_1.default.instance();
        return crypto_1.default
            .createHmac('sha256', config.json().salt + String(this.id))
            .update(String((new Date()).getMilliseconds() + Math.floor(Math.random() * (10000 + 1))))
            .digest('base64');
    }
}
exports.default = User;
//# sourceMappingURL=User.js.map