import mysqli from './lib/mysqli';
import Config from "./lib/config"
import User from './model/User';
import auto_config from './auto_config'
import app from './app'

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

const config:Config = Config.instance()

mysqli().query(`SELECT * FROM config WHERE id = 1`, (err, result) => {
    if(err) return;
    if(result.length == 0) return;
    config.setEmailReceiver(result[0].email_receiver)
    config.setEmailSystem(result[0].email_system)
})

auto_config()

const isInProduction = config.type() == "production"

// http em desenvolvimento
app(isInProduction ? 80 : config.json().port) 
if(isInProduction) // https
    app(443)