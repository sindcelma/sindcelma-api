import { Router } from "express";
import ConveniosManager from './ConveniosManager';
import ConveniosService from "./ConveniosService";

const router = Router()

export default () => {

    // admin
    router.post('/add', ConveniosManager.add)
    router.post('/edit', ConveniosManager.edit)
    router.post('/delete', ConveniosManager.delete)

    router.get('/list', ConveniosService.list)
    router.post('/selected', ConveniosService.selected)

    return router

}
