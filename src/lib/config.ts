import {readFileSync} from 'fs';
import { join } from 'path'

class Config {
    
    private static config:Config;
    private values;
    private database;
    private typeinstance;
    public static path = process.env.PATH || process.cwd();

    private constructor(){

        let res:Buffer = readFileSync(join(__dirname, `../../config.json`))
        const type = JSON.parse(res.toString()).type;
        this.typeinstance = type;

        let dat:Buffer = readFileSync(join(__dirname, `../../database.${type}.json`))
        this.database = JSON.parse(dat.toString())

        let con:Buffer = readFileSync(join(__dirname, `../../config.${type}.json`))
        this.values = JSON.parse(con.toString())

    }

    public static instance(){
        if(Config.config == null){
            Config.config = new Config()
        }
        return Config.config;
    }

    public json(){
        return this.values;
    }

    public getDatabase(){
        return this.database;
    }

    public type(){
        return this.typeinstance;
    }

}

export default Config


