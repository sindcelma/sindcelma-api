import { Express, Request, Response } from "express";
import cct_routes from './services/CCT/routes'
import socio_routes  from './services/socio/routes'
import auth_routes  from './services/auth/routes'
import tests_routes from './services/tests/routes'

export default (app:Express) => {

    app.use('/test', tests_routes())

    app.use('/cct', cct_routes())
    app.use('/socio', socio_routes())
    app.use('/auth', auth_routes())
    app.use('/', (req:Request, res:Response) => res.send("BAD REQUEST"))

}
