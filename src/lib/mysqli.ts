import Config from "./config";
import { createConnection } from "mysql";

export default () => {

    const database = Config.instance().getDatabase()

    const mysqli   = createConnection({
        host:database.host,
        user:database.user,
        password:database.pass,
        port:database.port,
        database:database.name
    })

    mysqli.connect()
    return mysqli
}

