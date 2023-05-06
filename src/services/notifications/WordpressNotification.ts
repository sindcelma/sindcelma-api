
import { Request, Response } from 'express'
import Config from '../../lib/config';
import response from '../../lib/response';
import firebase from '../../lib/firebase';

class WordpressNotification {

    public static send(req:Request, res:Response){

        if(!req.body.pair || !req.body.title || !req.body.text){
            return response(res).error(400, 'Bad Request')
        }

        if(req.body.pair != Config.instance().getPair()){
            return response(res).error(401, 'Unauthorized')
        }

        firebase.sendNotification(req.body.title, req.body.text)
        response(res).success()

    }

}

export default WordpressNotification;