import { Router } from "express";
import ComunicadosService from "./ComunicadosService";
import ComunicadoManager from './ComunicadosManager';


const router = Router()

export default () => {
    
    router.post('/add', ComunicadoManager.add)
    router.post('/edit', ComunicadoManager.edit)
    router.post('/status', ComunicadoManager.status)

    router.get('/get_last_active', ComunicadosService.get_last_active)

    return router
}