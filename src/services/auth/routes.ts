import { Router } from "express";
import AuthService from "./AuthService";
import AuthAdmin from './AuthAdmin';

const router = Router()

export default () => {

    router.get('/admin/login', AuthAdmin.login)
    router.get('/rememberme', AuthService.rememberme)
    return router

}
