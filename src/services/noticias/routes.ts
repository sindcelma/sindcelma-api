import { Router } from "express";
import NoticiasManager from "./NoticiasManager";
import NoticiasService from './NoticiasService';


const router = Router()

export default () => {
    
    router.post('/add', NoticiasManager.add)
    router.post('/edit', NoticiasManager.edit)
    router.post('/delete', NoticiasManager.delete)

    router.get('/last', NoticiasService.last)
    router.post('/list/:page?', NoticiasService.list)
    router.get('/list/:page?', NoticiasService.list)
    router.get('/get/:id', NoticiasService.get)

    return router
}