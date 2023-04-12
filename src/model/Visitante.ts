import { DataUser } from '../lib/jwt';
import User from './User';

class Visitante extends User {

    constructor(){
        const visitante:DataUser = {
            id:0,
            email:'',
            version:0
        }
        super("Visitante",visitante)
    }

}


export default Visitante