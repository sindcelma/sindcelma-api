import { Router } from "express";
import SessionTest from "./SessionsTest";
import Config from "../../lib/config"
const router = Router()

export default () => {

    console.log(Config.instance().json().url);
    
    //router.post('/gerarSessao', SessionTest.genSessionTest)
    router.get('/checarSessao', SessionTest.checarTipoDeSessao)
    return router

}
