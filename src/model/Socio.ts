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


}

export default Socio