import User from './User';
import { DataUser, DataSocio } from "../lib/jwt"
import { dateFormat } from '../lib/data';

class Socio extends User {

    private nome:String = ""
    private sobrenome:String = ""
    private slug:String = ""
    private status:Number = 0

    private rg:String = ""
    private sexo:String = ""
    private estado_civil:String = ""
    private telefone:String = ""
    private cargo:String = ""
    private num_matricula:String = ""
    private empresa:String = ""

    private data_nascimento:String = ""
    private data_nascimento_en:String = ""
    private data_admissao:String = ""
    private data_en:String = ""

    constructor(user:DataUser) {
        super("Socio", user)
    }

    public setOthersDatas(data:DataSocio){
        
        const dataAdmissao      = data.data_admissao.toString();
        const dataNascimento    = data.data_nascimento.toString();
        
        this.data_admissao      = dateFormat(new Date(dataAdmissao), 'dd/MM/yyyy');
        this.data_en            = dateFormat(new Date(dataAdmissao), 'yyyy-MM-dd');
        
        this.data_nascimento    = dateFormat(new Date(dataNascimento), 'dd/MM/yyyy');
        this.data_nascimento_en = dateFormat(new Date(dataNascimento), 'yyyy-MM-dd');
      
        this.rg = data.rg;
        this.sexo = data.sexo;
        this.estado_civil = data.estado_civil;
        this.telefone = data.telefone;
        this.cargo = data.cargo;
        
        this.num_matricula = data.num_matricula;
        this.empresa = data.nome_empresa;
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