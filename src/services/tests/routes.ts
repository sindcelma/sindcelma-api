import { Router } from "express";
import SessionTest from "./SessionsTest";
import EmailTest from './EmailTest'
import Config from "../../lib/config"
import Tests from "./Tests";
import FirebaseTest from './FirebaseTest'
const router = Router()

export default () => {
    
    if(Config.instance().type() == 'development'){
        
        //router.post('/gerarSessao', SessionTest.genSessionTest)
        router.post('/change_image', Tests.change_image)
        router.post('/pair', Tests.pair)
        router.get('/saveWinner', FirebaseTest.saveWinner)
        router.get('/sendEmail', EmailTest.sendEmail)
        router.get('/checarSessao', SessionTest.checarTipoDeSessao)
        router.get('/api/',Tests.api)
        router.get('/set/',Tests.setEmail)
        router.post('/api/',Tests.api_post)
        router.get('/401/',Tests.logout)
        router.post('/salvar_email', Tests.save_email)

    }    
    
    return router

}
