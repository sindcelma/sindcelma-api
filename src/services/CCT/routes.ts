import { Router } from "express";
import ConvencaoColetiva from "./ConvencaoColetiva";
import CCTManager from "./CCTMananger";
import CCTStats from "./CCTStats";

const router = Router()

export default () => {

    /**
     * Testar
     */
    router.post('/stats/list', CCTStats.list)
    router.post('/stats/select', CCTStats.select)
    
    /**
     * Testar
     */
    router.post('/add_cct', CCTManager.add_cct)
    router.post('/add_item', CCTManager.add_item)
    router.post('/edit_cct', CCTManager.edit_cct)
    router.post('/edit_item', CCTManager.edit_item)
    router.post('/delete_cct', CCTManager.delete_cct)
    router.post('/delete_item', CCTManager.delete_item)
    router.post('/publish', CCTManager.publish)


    router.post('/list', ConvencaoColetiva.list)
    router.post('/itens_by_socio', ConvencaoColetiva.itens_by_socio)
    router.post('/list_itens_by_search', ConvencaoColetiva.list_itens_by_search)
    router.post('/item_detail', ConvencaoColetiva.item_detail)
    router.post('/save_fav', ConvencaoColetiva.save_fav)
    router.post('/get_last_cct', ConvencaoColetiva.get_last_cct)

    return router

}
