import { Router } from "express";
import SessionTest from "./SessionsTest";
import EmailTest from './EmailTest'
import Config from "../../lib/config"
import Tests from "./Tests";
import FirebaseTest from './FirebaseTest'
const router = Router()

export default () => {

    //router.post('/gerarSessao', SessionTest.genSessionTest)
    router.get('/saveWinner', FirebaseTest.saveWinner)
    router.get('/sendEmail', EmailTest.sendEmail)
    router.get('/checarSessao', SessionTest.checarTipoDeSessao)
    router.get('/api/',Tests.api)
    router.post('/api/',Tests.api_post)
    router.get('/401/',Tests.logout)
    return router

}
