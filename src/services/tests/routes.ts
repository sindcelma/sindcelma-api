import { Router } from "express";
import SessionTest from "./SessionsTest";

const router = Router()

export default () => {

    router.get('/gerarSessao', SessionTest.genSessionTest)
    router.get('/checarSessao', SessionTest.checarTipoDeSessao)
    return router

}
