"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ComunicadosService_1 = __importDefault(require("./ComunicadosService"));
const ComunicadosManager_1 = __importDefault(require("./ComunicadosManager"));
const router = (0, express_1.Router)();
exports.default = () => {
    router.post('/add', ComunicadosManager_1.default.add);
    router.post('/edit', ComunicadosManager_1.default.edit);
    router.post('/status', ComunicadosManager_1.default.status);
    router.get('/list_active', ComunicadosService_1.default.list_active);
    router.get('/get_last_active', ComunicadosService_1.default.get_last_active);
    return router;
};
//# sourceMappingURL=routes.js.map