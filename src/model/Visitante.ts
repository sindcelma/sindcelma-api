import { DataUser } from '../lib/jwt';
import User from './User';

class Visitante extends User {

    constructor(){
        const visitante:DataUser = {
            id:0,
            nome:'',
            sobrenome:'',
            email:'',
            ativo:false
        }
        super("Visitante",visitante)
    }

}


export default Visitante