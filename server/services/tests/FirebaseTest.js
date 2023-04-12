"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = __importDefault(require("../../lib/firebase"));
const response_1 = __importDefault(require("../../lib/response"));
class FirebaseTest {
    static saveWinner(req, res) {
        firebase_1.default.addWinner(2, 2);
        (0, response_1.default)(res).success();
    }
}
exports.default = FirebaseTest;
//# sourceMappingURL=FirebaseTest.js.map