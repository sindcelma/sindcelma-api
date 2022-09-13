import { Router } from "express";
import AuthService from "./AuthService";

const router = Router()

export default () => {

    router.get('/login', AuthService.login)
    return router

}
