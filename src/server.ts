import { join } from 'path';
import cors from 'cors';
import express, { Express, Response, Request } from "express";
import Config from "./lib/config"
import routes from "./routes";
import User from './model/User';
import { middleware } from './model/UserFactory'
import SocioManager from './services/user/SocioManager';
import auto_config from './auto_config'

declare global{
    namespace Express {
        interface Request {
            user: User
        }
    }
}

declare global{
    namespace Express {
        interface Response {
            user?: User
        }
    }
}

const app:Express = express()
const config:Config = Config.instance()

const PORT = config.type() == "production" ? process.env.PORT || 80 : config.json().port;

const cors_options: cors.CorsOptions = {
    origin: "*"
};

auto_config()
app.use(cors(cors_options))
app.use(express.static(join(__dirname,'public')))
app.use(express.json())
// inserir rotas publicas aqui
app.get('/socio_verify/:token', SocioManager.verify_by_qrcode_token)

app.use('/', middleware)
routes(app)

app.listen(PORT, () => {
    console.log(`API ativa na porta ${PORT}`)
})