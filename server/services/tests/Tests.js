"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = __importDefault(require("../../lib/response"));
const config_1 = __importDefault(require("../../lib/config"));
const node_fetch_1 = __importDefault(require("node-fetch"));
class Tests {
    static change_image(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield (0, node_fetch_1.default)(`${config_1.default.instance().json().asset}/api/admin_file/change_name`, {
                method: 'POST',
                body: JSON.stringify(req.body)
            });
            const body = yield result.text();
            console.log(body);
            const resp = yield JSON.parse(body);
            console.log(resp);
            if (resp.code != 200) {
                return (0, response_1.default)(res).error(resp.code, resp.message);
            }
            (0, response_1.default)(res).success();
        });
    }
    static pair(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield (0, node_fetch_1.default)(`${config_1.default.instance().json().asset}/api/server_file/add_random_fav`, {
                method: 'POST',
                body: JSON.stringify(req.body)
            });
            const body = yield result.json();
            console.log(body);
            if (body.code != 200) {
                return (0, response_1.default)(res).error(body.code, body.message);
            }
            (0, response_1.default)(res).success();
        });
    }
    static api(req, res) {
        console.log(config_1.default.instance().getEmailReceiver());
        console.log(config_1.default.instance().getEmailSystem());
        return (0, response_1.default)(res).success({ test: "testando" });
    }
    static setEmail(req, res) {
        config_1.default.instance().setEmailReceiver('Outro@gmail.com');
        return (0, response_1.default)(res).success({ test: "ok" });
    }
    static api_post(req, res) {
        return (0, response_1.default)(res).success(req.body);
    }
    static logout(req, res) {
        return (0, response_1.default)(res).error(401, 'Unauthorized');
    }
}
exports.default = Tests;
//# sourceMappingURL=Tests.js.map