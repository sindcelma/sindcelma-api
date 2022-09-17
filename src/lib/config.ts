import {readFileSync} from 'fs';

class Config {
    
    private static config:Config;
    private values;
    private database;

    private constructor(){
        let res:Buffer = readFileSync(`${process.cwd()}\\config.json`);
        this.values = JSON.parse(res.toString());
        let dat:Buffer = readFileSync(`${process.cwd()}\\database.${this.values.type}.json`)
        this.database = JSON.parse(dat.toString())
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

}

export default Config


