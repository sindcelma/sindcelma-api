import { Router } from "express";
import WordpressNotification from './WordpressNotification'

const router = Router()

export default () => {
    
    router.post('/send', WordpressNotification.send)
    
    return router

}
