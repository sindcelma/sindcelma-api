import { Express, Request, Response } from "express";
import cct_routes from './services/CCT/routes'
import socio_routes  from './services/socio/routes'

export default (app:Express) => {

    app.use('/cct', cct_routes())
    app.use('/socio', socio_routes())
    app.use('/', (req:Request, res:Response) => res.send("BAD REQUEST"))

}
