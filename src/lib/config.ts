import {readFileSync} from 'fs';
import { join } from 'path'

interface conf {
    app_version:string,
    api_version:string,
    package:string
}

class Config {
    
    private static config:Config;
    private values;
    private database;
    private typeinstance;
    private configurate;
    private config_data:conf;
    public static path = process.env.PATH || process.cwd();

    private constructor(){

        let res:Buffer    = readFileSync(join(__dirname, `../../config.json`))
        const conf        = JSON.parse(res.toString());
        
        this.typeinstance = conf.type;
        this.configurate  = conf.config
        this.config_data  = conf

        this.config_data  = {
            app_version:conf.app_version,
            api_version:conf.api_version,
            package:conf.package
        }

        let dat:Buffer    = readFileSync(join(__dirname, `../../database.${this.typeinstance}.json`))
        this.database     = JSON.parse(dat.toString())

        let con:Buffer    = readFileSync(join(__dirname, `../../config.${this.typeinstance}.json`))
        this.values       = JSON.parse(con.toString())

    }

    public static instance(){
        if(Config.config == null){
            Config.config = new Config()
        }
        return Config.config;
    }

    public info(){
        return this.config_data
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

    public hasConfig(){
        return this.configurate;
    }

}

export default Config


