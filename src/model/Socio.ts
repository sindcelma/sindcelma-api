import User from './User';
import { DataUser } from "../lib/jwt"

class Socio extends User {

    constructor(user:DataUser) {
        super("Socio", user)
    }

}

export default Socio