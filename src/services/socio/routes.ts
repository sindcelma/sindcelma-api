import { Router } from "express";
import Socio from "./Socio";


const router = Router()

export default () => {

    router.get('/list', Socio.list)
    return router

}
