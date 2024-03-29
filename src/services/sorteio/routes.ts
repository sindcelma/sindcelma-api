import { Router } from "express";
import SorteioManager from "./SorteioManager";
import SorteioService from './SorteioService'

const router = Router()

export default () => {

    router.post('/add', SorteioManager.add)
    router.post('/update', SorteioManager.update)
    router.post('/change_status', SorteioManager.changeStatus)
    router.post('/sortear', SorteioManager.sortear)
    router.post('/list_all', SorteioManager.list)

    router.post('/last_by_user', SorteioService.get_last_ativo_by_user)
    router.post('/last', SorteioService.get_last)
    router.post('/inscricao', SorteioService.inscreverSe)
    router.post('/list', SorteioService.list)
    
    router.get('/:sorteio_id', SorteioService.get_sorteio)
    router.get('/:sorteio_id/participantes', SorteioService.get_participantes)
    router.get('/:sorteio_id/vencedores', SorteioService.get_vencedores)

    return router;
    
}