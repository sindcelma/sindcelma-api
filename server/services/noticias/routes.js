"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NoticiasManager_1 = __importDefault(require("./NoticiasManager"));
const NoticiasService_1 = __importDefault(require("./NoticiasService"));
const router = (0, express_1.Router)();
exports.default = () => {
    router.post('/add', NoticiasManager_1.default.add);
    router.post('/edit', NoticiasManager_1.default.edit);
    router.post('/delete', NoticiasManager_1.default.delete);
    router.get('/last', NoticiasService_1.default.last);
    router.post('/list/:page?', NoticiasService_1.default.list);
    router.get('/list/:page?', NoticiasService_1.default.list);
    router.get('/get/:id', NoticiasService_1.default.get);
    return router;
};
//# sourceMappingURL=routes.js.map