
import { Request, Response } from 'express';
import Config from '../lib/config';
import response from '../lib/response';

class Info {

    public static info(req:Request, res:Response){
        response(res).success(Config.instance().info())
    }

}

export default Info