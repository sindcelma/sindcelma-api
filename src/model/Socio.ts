import User from './User';
import { DataUser, DataSocio } from "../lib/jwt"
import { dateFormat } from '../lib/data';

class Socio extends User {

    private nome:String = ""
    private sobrenome:String = ""
    private slug:String = ""
    private status:Number = 0

    private salt:String = ""
    private sexo:String = ""
    private estado_civil:String = ""
    private telefone:String = ""
    private cargo:String = ""
    private num_matricula:String = ""
    private empresa:String = ""

    private data_nascimento:any = ""
    private data_nascimento_en:any = ""
    private data_admissao:any = ""
    private data_en:any = ""

    private hasCodeDev:boolean = false;

    constructor(user:DataUser) {
        super("Socio", user)
    }

    public setOthersDatas(data:DataSocio){
        
        this.data_admissao      = data.data_admissao != null   ? dateFormat(new Date(data.data_admissao.toString()), 'dd/MM/yyyy') : null;
        this.data_en            = data.data_admissao != null   ? dateFormat(new Date(data.data_admissao.toString()), 'yyyy-MM-dd') : null;
        
        this.data_nascimento    = data.data_nascimento != null ? dateFormat(new Date(data.data_nascimento.toString()), 'dd/MM/yyyy') : null; 
        this.data_nascimento_en = data.data_nascimento != null ? dateFormat(new Date(data.data_nascimento.toString()), 'yyyy-MM-dd') : null;
      
        this.salt = data.salt;
        this.sexo = data.sexo;
        this.estado_civil = data.estado_civil;
        this.telefone = data.telefone;
        this.cargo = data.cargo;
        
        this.num_matricula = data.num_matricula;
        this.empresa = data.nome_empresa;

        this.hasCodeDev = data.hasCodeDev != null;
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