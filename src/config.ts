import {readFileSync} from 'fs';

class Config {
    
    private static config:Config;
    private values;

    private constructor(){
        let res:Buffer = readFileSync(process.cwd()+'\\config.json');
        this.values = JSON.parse(res.toString());
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

}

export default Config


