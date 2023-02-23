import User from "./User";
import { DataUser } from "../lib/jwt"

class Admin extends User {

    private slug:String = ""
    private nome:String = ""
    private master:boolean = false
    private access:string[] = []

    constructor(user:DataUser) {
        super("Admin", user)
    }

    public setMaster(num:number){
        this.master = num == 1
    }

    public setAccess(access:string[]){
        this.access = access
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

    public hasAccess(service_slug:string){
        return this.access.includes(service_slug)
    }

    public isMaster(){
        return this.master
    }

}

export default Admin