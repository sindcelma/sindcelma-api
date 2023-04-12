"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SessionsTest_1 = __importDefault(require("./SessionsTest"));
const EmailTest_1 = __importDefault(require("./EmailTest"));
const config_1 = __importDefault(require("../../lib/config"));
const Tests_1 = __importDefault(require("./Tests"));
const FirebaseTest_1 = __importDefault(require("./FirebaseTest"));
const router = (0, express_1.Router)();
exports.default = () => {
    if (config_1.default.instance().type() == 'developement') {
        //router.post('/gerarSessao', SessionTest.genSessionTest)
        router.post('/pair', Tests_1.default.pair);
        router.get('/saveWinner', FirebaseTest_1.default.saveWinner);
        router.get('/sendEmail', EmailTest_1.default.sendEmail);
        router.get('/checarSessao', SessionsTest_1.default.checarTipoDeSessao);
        router.get('/api/', Tests_1.default.api);
        router.get('/set/', Tests_1.default.setEmail);
        router.post('/api/', Tests_1.default.api_post);
        router.get('/401/', Tests_1.default.logout);
    }
    return router;
};
//# sourceMappingURL=routes.js.map