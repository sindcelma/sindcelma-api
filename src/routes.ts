import { Express, Request, Response } from "express";
import cct_routes from './services/CCT/routes'
import user_routes  from './services/user/routes'
import tests_routes from './services/tests/routes'

export default (app:Express) => {

    app.use('/test', tests_routes())
    app.use('/cct', cct_routes())
    app.use('/user', user_routes())
    app.use('/', (req:Request, res:Response) => res.send("BAD REQUEST"))

}
