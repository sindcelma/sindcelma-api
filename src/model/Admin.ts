import User from "./User";
import { DataUser } from "../lib/jwt"

class Admin extends User {

    private slug:String = ""
    private nome:String = ""

    constructor(user:DataUser) {
        super("Admin", user)
    }

    public setSlug(slug:String){
        this.slug = slug
    }

    public getSlug(){
        return this.slug
    }

    public setNome(nome:String){
        this.nome = nome
    }

    public getNome(){
        return this.nome
    }

}

export default Admin