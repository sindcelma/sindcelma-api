import { Pool } from 'mysql';
import aws from './aws';
import { generateSlug } from './jwt';
import mysqli from './mysqli';





// status 1 - ativo
// status 2 - descadastrado pelo usuario
// status 3 - desativado pelo sistema - erro tipo 1
// status 4 - desativado pelo sistema - erro tipo 2
// ...


interface mailing {
    nome:string,
    email:string,
    isSocio:boolean,
    status:number
}

const _salvar_email = (conn:Pool, mailing:mailing, callback:(s:boolean) => void) => {

    let tentar = 0
    let socio  = mailing.isSocio ?  1 : 0
    let hash = generateSlug(mailing.nome+mailing.email+tentar)
           
    conn.query("INSERT INTO mailing VALUES (0, ?, ?, ?, ?, ?)", 
            [hash, mailing.nome, mailing.email, socio, mailing.status], 
            async err => {
                if(!err){
                    /*
                    let resp = await new aws().ses().config({
                        de:'atendimento@sindcelmatecnologia.com.br',
                        para:mailing.email,
                        assunto:'testando'
                    }).send()
                    console.log(resp.$response.error)
                    */
                    callback(true)
                }
                else callback(false)
            }
        )

}

const salvar_email = (nome:string, email:string, isSocio:boolean, callback:(s:boolean) => void) => {

    let conn = mysqli()

    interface resp {
        email:string,
        ativo:number
    }

    conn.query("SELECT email, ativo FROM mailing WHERE email = ?", 
    [email], (err, result:resp[]) => {
        
        if(err) return callback(false);
        
        let maillingObj = {
            nome:nome,
            email:email,
            isSocio:isSocio,
            status:1
        }

        if(result.length == 0){
            return _salvar_email(conn, maillingObj,callback)
        }

        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            if(element.email == email){
                if(element.ativo != 1)
                conn.query("UPDATE mailing SET ativo = 1 WHERE email = ?", [email])
                return callback(true)
            }
        }

        _salvar_email(conn, maillingObj,callback)

    })


}

const get_mailing = (status:boolean, isSocio:boolean) => {

    // retorna a lista de emails conforme as variaveis enviadas

}

const update_email = (email:string, status:boolean) => {

    // altera o status do email

}

export default {

    salvar_email,
    get_mailing,
    update_email

}