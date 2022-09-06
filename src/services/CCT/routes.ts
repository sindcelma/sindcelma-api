import { Router } from "express";
import ConvencaoColetiva from "./ConvencaoColetiva";

const router = Router()

export default () => {

    router.get('/list', ConvencaoColetiva.list)
    return router

}
