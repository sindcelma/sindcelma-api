"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SessionsTest_1 = __importDefault(require("./SessionsTest"));
const config_1 = __importDefault(require("../../lib/config"));
const router = (0, express_1.Router)();
exports.default = () => {
    console.log(config_1.default.instance().json().url);
    //router.post('/gerarSessao', SessionTest.genSessionTest)
    router.get('/checarSessao', SessionsTest_1.default.checarTipoDeSessao);
    return router;
};
//# sourceMappingURL=routes.js.map