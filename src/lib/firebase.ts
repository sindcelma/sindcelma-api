import firebase from 'firebase-admin'
import fs from 'fs'
import { join } from 'path'
import Config from './config';

const serviceAccount:{
    type:string,
    project_id:string,
    private_key_id:string,
    private_key:string,
    client_email:string,
    client_id:string,
    auth_uri:string,
    token_uri:string,
    auth_provider_x509_cert_url:string,
    client_x509_cert_url:string,
} = JSON.parse(fs.readFileSync(join(__dirname, `../../firebase-key.${Config.instance().type()}.json`)).toString());

const app = firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    projectId:serviceAccount.project_id
});

export default {

    addWinner: (socio_id:number, sorteio_id:number) => {
        firebase.firestore().collection('vencedores_sorteio').add({
            socio_id,
            sorteio_id
        })
    }, 

    sendNotification: (title:string, message:string, devices:string[]) => {
        
        /*
        if(Config.instance().type() == 'development'){
            return console.log("Não foi possível enviar as notificações pois a API está em módulo de desenvolvimento.");
        }
        */
        try {
            firebase.messaging(app).sendToDevice(devices, {
                notification:{
                    title:title,
                    body:message,
                },
            })
        } catch(err){
            console.log(err);
            /// silencio...
        }
                
    }

}