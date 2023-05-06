"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const WordpressNotification_1 = __importDefault(require("./WordpressNotification"));
const router = (0, express_1.Router)();
exports.default = () => {
    router.post('/send', WordpressNotification_1.default.send);
    return router;
};
//# sourceMappingURL=routes.js.map