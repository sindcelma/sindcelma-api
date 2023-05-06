import firebase from 'firebase-admin'
import fs from 'fs'
import { join } from 'path'
import Config from './config';
import mysqli from './mysqli';

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


const sending = (title:string, message:string, devices:string[]) => {
    firebase.messaging(app).sendToDevice(devices, {
        notification:{
            title:title,
            body:message,
        },
    })
}

export default {

    addWinner: (socio_id:number, sorteio_id:number) => {
        firebase.firestore().collection('vencedores_sorteio').add({
            socio_id,
            sorteio_id
        })
    }, 

    sendNotification: (title:string, message:string, devices:string[] = []) => {

        if(devices.length == 0){
            mysqli().query("SELECT user_devices.code FROM `user_devices` WHERE NOT user_devices.code is null;", (err, resp) => {
                sending(title, message, resp.map(r => r.code));
            })
            return;
        }
        
        sending(title, message, devices);
    }

}