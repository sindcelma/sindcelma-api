"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FileManager_1 = __importDefault(require("./FileManager"));
const router = (0, express_1.Router)();
exports.default = () => {
    router.post('/create', FileManager_1.default.create_ghost);
    router.post('/append', FileManager_1.default.append);
    router.post('/commit', FileManager_1.default.commit);
    return router;
};
//# sourceMappingURL=routes.js.map