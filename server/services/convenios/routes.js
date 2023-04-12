"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ConveniosManager_1 = __importDefault(require("./ConveniosManager"));
const ConveniosService_1 = __importDefault(require("./ConveniosService"));
const router = (0, express_1.Router)();
exports.default = () => {
    // admin
    router.post('/add', ConveniosManager_1.default.add);
    router.post('/edit', ConveniosManager_1.default.edit);
    router.post('/delete', ConveniosManager_1.default.delete);
    router.get('/list', ConveniosService_1.default.list);
    router.post('/selected', ConveniosService_1.default.selected);
    return router;
};
//# sourceMappingURL=routes.js.map