"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SorteioManager_1 = __importDefault(require("./SorteioManager"));
const SorteioService_1 = __importDefault(require("./SorteioService"));
const router = (0, express_1.Router)();
exports.default = () => {
    router.post('/add', SorteioManager_1.default.add);
    router.post('/update', SorteioManager_1.default.update);
    router.post('/change_status', SorteioManager_1.default.changeStatus);
    router.post('/sortear', SorteioManager_1.default.sortear);
    router.post('/list_all', SorteioManager_1.default.list);
    router.post('/last_by_user', SorteioService_1.default.get_last_ativo_by_user);
    router.post('/last', SorteioService_1.default.get_last);
    router.post('/inscricao', SorteioService_1.default.inscreverSe);
    router.post('/list', SorteioService_1.default.list);
    router.get('/:sorteio_id', SorteioService_1.default.get_sorteio);
    router.get('/:sorteio_id/participantes', SorteioService_1.default.get_participantes);
    router.get('/:sorteio_id/vencedores', SorteioService_1.default.get_vencedores);
    return router;
};
//# sourceMappingURL=routes.js.map