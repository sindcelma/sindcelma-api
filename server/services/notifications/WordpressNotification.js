"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../lib/config"));
const response_1 = __importDefault(require("../../lib/response"));
const firebase_1 = __importDefault(require("../../lib/firebase"));
class WordpressNotification {
    static send(req, res) {
        if (!req.body.pair || !req.body.title || !req.body.text) {
            return (0, response_1.default)(res).error(400, 'Bad Request');
        }
        if (req.body.pair != config_1.default.instance().getPair()) {
            return (0, response_1.default)(res).error(401, 'Unauthorized');
        }
        firebase_1.default.sendNotification(req.body.title, req.body.text);
        (0, response_1.default)(res).success();
    }
}
exports.default = WordpressNotification;
//# sourceMappingURL=WordpressNotification.js.map