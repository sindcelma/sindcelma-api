import { Request, Response } from "express";
import fire from '../../lib/firebase'
import response from "../../lib/response";

class FirebaseTest {

    public static saveWinner(req:Request, res:Response){
        fire.addWinner(2,2)
        response(res).success()
    }

}


export default FirebaseTest