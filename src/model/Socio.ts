import User from './User';
import { DataUser } from "../lib/jwt"

class Socio extends User {

    private nome:String = ""
    private sobrenome:String = ""
    private slug:String = ""
    private status:Number = 0

    constructor(user:DataUser) {
        super("Socio", user)
    }

    public setFullName(nome:String, sobrenome:String){
        this.nome = nome 
        this.sobrenome = sobrenome
    }

    public setSlug(slug:String){
        this.slug = slug
    }

    public setStatus(status:Number){
        this.status = status
    }

    public getSlug(){
        return this.slug
    }

    public static transformCpf(cpf:string){
        
        cpf = cpf.trim();

        const match = /(\d{2,3})\.?(\d{3})\.?(\d{3})-?(\d{2})$/.exec(cpf);
        
        if(match == null){
            return false;
        }

        return match[1]+"."+match[2]+"."+match[3]+"-"+match[4]

    }

}

export default Socio