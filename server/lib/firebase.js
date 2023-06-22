"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const config_1 = __importDefault(require("./config"));
const mysqli_1 = __importDefault(require("./mysqli"));
const serviceAccount = JSON.parse(fs_1.default.readFileSync((0, path_1.join)(__dirname, `../../firebase-key.${config_1.default.instance().type()}.json`)).toString());
const app = firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id
});
const sending = (title, message, devices) => {
    firebase_admin_1.default.messaging(app).sendToDevice(devices, {
        notification: {
            title: title,
            body: message,
        },
    });
};
exports.default = {
    addWinner: (socio_id, sorteio_id) => {
        firebase_admin_1.default.firestore().collection('vencedores_sorteio').add({
            socio_id,
            sorteio_id
        });
    },
    sendNotification: (title, message, devices = []) => {
        if (devices.length == 0) {
            (0, mysqli_1.default)().query("SELECT user_devices.code FROM `user_devices` WHERE NOT user_devices.code is null;", (err, resp) => {
                if (resp.length == 0)
                    return;
                sending(title, message, resp.map(r => r.code));
            });
            return;
        }
        sending(title, message, devices);
    }
};
//# sourceMappingURL=firebase.js.map