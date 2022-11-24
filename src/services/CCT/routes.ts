import { Router } from "express";
import ConvencaoColetiva from "./ConvencaoColetiva";

const router = Router()

export default () => {

    router.post('/list', ConvencaoColetiva.list)
    router.post('/itens_by_socio', ConvencaoColetiva.itens_by_socio)
    router.post('/list_itens_by_search', ConvencaoColetiva.list_itens_by_search)
    router.post('/item_detail', ConvencaoColetiva.item_detail)
    router.post('/save_fav', ConvencaoColetiva.save_fav)
    router.post('/get_last_cct', ConvencaoColetiva.get_last_cct)

    return router

}
