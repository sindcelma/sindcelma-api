import {readFileSync} from 'fs';

class Config {
    
    private static config:Config;
    private values;
    private database;

    private constructor(){

        let res:Buffer = readFileSync(`${process.cwd()}/config.json`);
        const type = JSON.parse(res.toString()).type;
        
        let dat:Buffer = readFileSync(`${process.cwd()}/database.${type}.json`)
        this.database = JSON.parse(dat.toString())

        let con:Buffer = readFileSync(`${process.cwd()}/config.${type}.json`)
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

}

export default Config


