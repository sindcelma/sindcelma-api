import { join } from 'path';
import cors from 'cors';
import express, { Express } from "express";
import routes from "./routes";
import { middleware } from './model/UserFactory'
import SocioManager from './services/user/SocioManager';

export default (port:number) => {

    const app:Express = express()
    const cors_options: cors.CorsOptions = {
        origin: "*"
    };
    app.use(cors(cors_options))
    app.use(express.static(join(__dirname,'public')))
    app.use(express.json())

    // inserir rotas publicas aqui
    app.get('/socio_verify/:token', SocioManager.verify_by_qrcode_token)

    app.use('/', middleware)
    routes(app)

    app.listen(port, () => {
        console.log(`API ativa na porta ${port}`)
    })

}