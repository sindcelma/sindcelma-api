"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ConvencaoColetiva_1 = __importDefault(require("./ConvencaoColetiva"));
const router = (0, express_1.Router)();
exports.default = () => {
    router.post('/list', ConvencaoColetiva_1.default.list);
    router.post('/itens_by_socio', ConvencaoColetiva_1.default.itens_by_socio);
    router.post('/list_itens_by_search', ConvencaoColetiva_1.default.list_itens_by_search);
    router.post('/item_detail', ConvencaoColetiva_1.default.item_detail);
    router.post('/save_fav', ConvencaoColetiva_1.default.save_fav);
    router.post('/get_last_cct', ConvencaoColetiva_1.default.get_last_cct);
    return router;
};
//# sourceMappingURL=routes.js.map