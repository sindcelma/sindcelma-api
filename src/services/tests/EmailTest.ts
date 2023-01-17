import { Request, Response } from "express";
import AwsService from "../../lib/aws";
import response from "../../lib/response";
import fs from 'fs'
import { join } from "path";

class EmailTest {


    public static sendEmail(req:Request, res:Response){

        new AwsService().ses()
        .config({
            de:"atendimento@sindcelmatecnologia.com.br",
            para:"andreifcoelho@gmail.com",
            assunto:"Recuperação de senha",
            data:{
                nome:"Andrei",
                codigo:"09f38"
            }
        })
        .setTemplate(fs.readFileSync(join(__dirname, '../../html/recover.html')).toString())
        .send()

        response(res).success()

    }

    
}

export default EmailTest