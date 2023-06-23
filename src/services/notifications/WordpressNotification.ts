
import { Request, Response } from 'express'
import Config from '../../lib/config';
import response from '../../lib/response';
import firebase from '../../lib/firebase';

class WordpressNotification {

    public static send(req:Request, res:Response){

        try {
            if(!req.body.pair || !req.body.title){
                return response(res).error(400, 'Bad Request')
            }
    
            if(req.body.pair != Config.instance().getPair()){
                return response(res).error(401, 'Unauthorized')
            }

            console.log("aqui");
            
    
            firebase.sendNotification('Notícias', req.body.title)
            response(res).success()
        } catch (error) {
            console.log(error);
        }

    }

}

export default WordpressNotification;