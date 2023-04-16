"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const config_1 = __importDefault(require("./config"));
const serviceAccount = JSON.parse(fs_1.default.readFileSync((0, path_1.join)(__dirname, `../../firebase-key.${config_1.default.instance().type()}.json`)).toString());
const app = firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id
});
exports.default = {
    addWinner: (socio_id, sorteio_id) => {
        firebase_admin_1.default.firestore().collection('vencedores_sorteio').add({
            socio_id,
            sorteio_id
        });
    },
    sendNotification: (title, message, devices) => {
        /*
        if(Config.instance().type() == 'development'){
            return console.log("Não foi possível enviar as notificações pois a API está em módulo de desenvolvimento.");
        }
        */
        if (devices.length == 0) {
            console.log("Não há aparelhos para enviar...");
            return;
        }
        try {
            firebase_admin_1.default.messaging(app).sendToDevice(devices, {
                notification: {
                    title: title,
                    body: message,
                },
            });
        }
        catch (err) {
            console.log(err);
            /// silencio...
        }
    }
};
//# sourceMappingURL=firebase.js.map