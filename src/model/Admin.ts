import User from "./User";
import { DataUser } from "../lib/jwt"

class Admin extends User {

    private slug:String = ""

    constructor(user:DataUser) {
        super("Admin", user)
    }

    public setSlug(slug:String){
        this.slug = slug
    }

    public getSlug(){
        return this.slug
    }

}

export default Admin