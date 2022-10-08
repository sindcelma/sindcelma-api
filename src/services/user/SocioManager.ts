import { Request, Response } from "express";
import assertion from "../../lib/assertion";
import mysqli from "../../lib/mysqli";
import response from "../../lib/response";
import { createHmac } from "crypto";
import Config from "../../lib/config";

class SocioManager {


    public static get_socio_by_login(req:Request, res:Response){
        // verificar se o cliente enviou email ou CPF 
        // verificar se se há um usuário cadastrado
        // - se não houver avisar o cliente para cadastrar 
        //   verificar se houve confirmação através de código
        //   - se houver confirmação solicitar senha 
        //   - se não houver solicitar confirmação
    }

    public static cadastrar_usuario(req:Request, res:Response){
        // verificar se o cliente enviou o CPF, email, senha e telefone (se ele quiser)
        // salvar no mailing o email e o telefone se ele solicitar receber notificações
    }

    public static update_usuario(req:Request, res:Response){
        // alterar email
    }

    public static confirmar_cadastro(req:Request, res:Response){
        // verificar se o cliente enviou o CPF, email com o código de confirmação
    }

    public static recuperar_login(req:Request, res:Response){
        // gerar o código e enviar via email ou telefone
    }

    public static checar_codigo_login(req:Request, res:Response){
        // verificar o codigo
    }

    public static cadastrar_socio(req:Request, res:Response){
        // Nome, sobrenome, CPF
    }

    public static add_dados_profissionais(req:Request, res:Response){
        // cargo, empresa, etc...
        // verificar se o user é admin
        // verificar se o user é um sócio, se for um sócio verificar se o id é o mesmo
        // que o do usuário que será registrado
        // socio slug 
    }

    public static add_dados_pessoais(req:Request, res:Response){
        // verificar se o user é admin
        // verificar se o user é um sócio, se for um sócio verificar se o id é o mesmo
        // que o do usuário que será registrado
        // socio slug 
    }

    public static list(req:Request, res:Response){
        
        try {
            assertion(res)
            .isAdmin(req.user)
            .assert()
        } catch (error) {
            return false
        }

        response(res).success()
    }

    public static aprove(req:Request, res:Response){
        try {
            assertion(res)
            .isAdmin(req.user)
            .assert()
        } catch (error) {
            return false
        }

        response(res).success()
    }

    public static update_dados_socio(req:Request, res:Response){
        // nao pode alterar cpf
    }

    public static update_dados_profissionais(req:Request, res:Response){

    }

    public static update_dados_pessoais(req:Request, res:Response){

    }

}

export default SocioManager