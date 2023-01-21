"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const serviceAccount = JSON.parse(fs_1.default.readFileSync((0, path_1.join)(__dirname, '../../firebase-key.json')).toString());
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount)
});
exports.default = {
    addWinner: (socio_id, sorteio_id) => {
        firebase_admin_1.default.firestore().collection('vencedores_sorteio').add({
            socio_id,
            sorteio_id
        });
    },
    sendNotification: () => {
    }
};
//# sourceMappingURL=firebase.js.map