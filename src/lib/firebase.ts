import firebase from 'firebase-admin'
import fs from 'fs'
import { join } from 'path'

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
        firebase.messaging(app).sendToDevice(devices, {
            notification:{
                title:title,
                body:message,
            },
        })
    }

}