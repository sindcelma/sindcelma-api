import { Express, Request, Response } from "express";
import cct_routes from './services/CCT/routes'

export default (app:Express) => {

    app.use('/cct', cct_routes())
    app.use('/', (req:Request, res:Response) => res.send("BAD REQUEST"))

}
