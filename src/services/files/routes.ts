import { Router } from "express";
import FileManager from "./FileManager";

const router = Router()

export default () => {

    router.post('/create', FileManager.create_ghost)
    router.post('/append', FileManager.append)
    router.post('/commit', FileManager.commit)
    return router

}
