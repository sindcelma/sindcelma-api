"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const config_1 = __importDefault(require("./config"));
const serviceAccount = JSON.parse(fs_1.default.readFileSync((0, path_1.join)(__dirname, '../../firebase-key.json')).toString());
const app = firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
    projectId: "sindcelma-app-1f97d"
});
exports.default = {
    addWinner: (socio_id, sorteio_id) => {
        firebase_admin_1.default.firestore().collection('vencedores_sorteio').add({
            socio_id,
            sorteio_id
        });
    },
    sendNotification: (title, message, devices) => {
        if (config_1.default.instance().type() == 'development') {
            return console.log("Não foi possível enviar as notificações pois a API está em módulo de desenvolvimento.");
        }
        firebase_admin_1.default.messaging(app).sendToDevice(devices, {
            notification: {
                title: title,
                body: message,
            },
        });
    }
};
//# sourceMappingURL=firebase.js.map