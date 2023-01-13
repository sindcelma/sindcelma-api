import Config from "./config";
import { createPool } from "mysql";

const database = Config.instance().getDatabase()

const mysqli   = createPool({
    host:database.host,
    user:database.user,
    password:database.pass,
    port:database.port,
    database:database.name
})

export default () => mysqli

