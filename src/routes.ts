import { Express, Request, Response } from "express";

import cct_routes         from './services/CCT/routes'
import user_routes        from './services/user/routes'
import tests_routes       from './services/tests/routes'
import files_routes       from './services/files/routes'
import sorteios_routes    from './services/sorteio/routes'
import noticias_routes    from './services/noticias/routes'
import comunicados_routes from './services/comunicados/routes'
import convenios_routes   from './services/convenios/routes'

import Info from './services/Info'

export default (app:Express) => {

    app.get('/info', Info.info)
    app.use('/sorteios', sorteios_routes())
    app.use('/test', tests_routes())
    app.use('/cct', cct_routes())
    app.use('/user', user_routes())
    app.use('/files', files_routes())
    app.use('/noticias', noticias_routes())
    app.use('/comunicados', comunicados_routes())
    app.use('/convenios', convenios_routes())
    app.use('/', (req:Request, res:Response) => res.send("BAD REQUEST"))

}
