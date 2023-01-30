import firebase from 'firebase-admin'
import fs from 'fs'
import { join } from 'path'
import Config from './config';

const serviceAccount = JSON.parse(fs.readFileSync(join(__dirname, '../../firebase-key.json')).toString());

const app = firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    projectId:"sindcelma-app-1f97d"
});

export default {

    addWinner: (socio_id:number, sorteio_id:number) => {
        firebase.firestore().collection('vencedores_sorteio').add({
            socio_id,
            sorteio_id
        })
    }, 

    sendNotification: (title:string, message:string, devices:string[]) => {
        
        if(Config.instance().type() == 'development'){
            return console.log("Não foi possível enviar as notificações pois a API está em módulo de desenvolvimento.");
        }

        firebase.messaging(app).sendToDevice(devices, {
            notification:{
                title:title,
                body:message,
            },
        })
                
    }

}