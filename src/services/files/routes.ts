import { Router } from "express";
import FileUserManager from "./FileUserManager";
import FileAdminManager from "./FileAdminManager";

const router = Router()

export default () => {

    /**
     * TESTAR
     */

    router.post('/admin/generate_csv', FileAdminManager.generateCSV)

    router.post('/admin/create', FileAdminManager.create_ghost)
    router.post('/admin/append', FileAdminManager.append)
    router.post('/admin/commit', FileAdminManager.commit)

    router.post('/create', FileUserManager.create_ghost)
    router.post('/append', FileUserManager.append)
    router.post('/commit', FileUserManager.commit)

    return router

}
