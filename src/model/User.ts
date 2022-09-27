import crypto from 'crypto'
import Config from '../lib/config';
import { DataUser } from "../lib/jwt"

abstract class User {
    
    private id:Number = 0
    private sess:String = ""
    private rememberMeToken:String = ""

    private nome:String
    private sobrenome:String
    private type:String
    
    constructor(type:String, user:DataUser) {
        this.type = type
        this.id = user.id
        this.nome = user.nome
        this.sobrenome = user.sobrenome
    }

    public getNome(){
        return this.nome 
    }

    public getNomeCompleto() {
        return this.nome + " " + this.sobrenome
    }

    public getSobrenome(){
        return this.sobrenome
    }

    public getType(){
        return this.type
    }

    public getSession(){
        return this.sess
    }

    public setSession(sess:String){
        this.sess = sess
    }

    public getRememberMeToken(){

        const config:Config = Config.instance()

        if(this.rememberMeToken == ""){
            this.rememberMeToken =  crypto
                                    .createHmac('sha256', config.json().salt+String(this.id))
                                    .update(String((new Date()).getMilliseconds() + Math.floor(Math.random() * (10000 + 1))))
                                    .digest('base64')
            
        }
            
        
        return this.rememberMeToken

    }

}

export default User