"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FileUserManager_1 = __importDefault(require("./FileUserManager"));
const FileAdminManager_1 = __importDefault(require("./FileAdminManager"));
const router = (0, express_1.Router)();
exports.default = () => {
    /**
     * TESTAR
     */
    router.post('/admin/generate_csv', FileAdminManager_1.default.generateCSV);
    router.post('/admin/create', FileAdminManager_1.default.create_ghost);
    router.post('/admin/append', FileAdminManager_1.default.append);
    router.post('/admin/commit', FileAdminManager_1.default.commit);
    router.post('/create', FileUserManager_1.default.create_ghost);
    router.post('/append', FileUserManager_1.default.append);
    router.post('/commit', FileUserManager_1.default.commit);
    return router;
};
//# sourceMappingURL=routes.js.map