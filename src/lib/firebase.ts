import firebase from 'firebase-admin'
import fs from 'fs'
import { join } from 'path'

const serviceAccount = JSON.parse(fs.readFileSync(join(__dirname, '../../firebase-key.json')).toString());

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
});

export default {

    addWinner: (socio_id:number, sorteio_id:number) => {
        firebase.firestore().collection('vencedores_sorteio').add({
            socio_id,
            sorteio_id
        })
    },

    sendNotification: () => {

    }

}