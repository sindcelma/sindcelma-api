import crypto from 'crypto'
import Config from '../lib/config';
import { DataUser } from "../lib/jwt"

abstract class User {
    
    private id:Number = 0
    private sess:String = ""
    private agent:String = ""
    private version:Number = 0
    private email:String = ""

    private type:String
    
    constructor(type:String, user:DataUser) {
        this.type = type
        this.id = user.id
        this.email = user.email
        this.version = user.version
    }

    public getId(){
        return this.id
    }

    public getVersion(){
        return this.version;
    }

    public getEmail(){
        return this.email;
    }

    public getType(){
        return this.type
    }

    public getSession(){
        return this.sess
    }

    public getAgent(){
        return this.agent
    }

    public setSession(sess:String){
        this.sess = sess
    }

    public setAgent(agent:String|undefined){
        if(agent)
        this.agent = agent
    }
    

    public getRememberMeToken(){

        const config:Config = Config.instance()

        return crypto
        .createHmac('sha256', config.json().salt+String(this.id))
        .update(String((new Date()).getMilliseconds() + Math.floor(Math.random() * (10000 + 1))))
        .digest('base64')

    }

}

export default User