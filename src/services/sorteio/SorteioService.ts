import { Request, Response } from 'express';
import mysqli from '../../lib/mysqli';
import response from '../../lib/response';
import assertion from "../../lib/assertion";
import Socio from '../../model/Socio';
import { dateFormat } from '../../lib/data';
import { Pool } from 'mysql';
import User from '../../model/User';

interface SorteioSocio {
    id:number,
    titulo:string,
    premios:string,
    qt_vencedores:number,
    data_sorteio:string,
    data?:String,
    vencedor?:boolean,
    inscrito?:boolean
}

class SorteioService {


    public static inscreverSe(req:Request, res:Response){

        if(!req.body.sorteio_id) return response(res).error(400, 'bad request')

        try {
            assertion()
            .isSocio(req.user)
            .assert()
        } catch (error) {
            return response(res).error(401, 'Unauthorized')
        }

        const sorteio_id  = Number(req.body.sorteio_id)
        const socio:Socio = <Socio>req.user
        const conn = mysqli();
       
        conn.query(`
            SELECT 
                    sorteio_participantes.id      as participante_id,
                    socios.id                     as socio_id,
                    socios_dados_pessoais.id      as dados_pessoais_id,
                    socios_dados_profissionais.id as dados_profissionais_id,
                    socios.diretor
            FROM        socios
            LEFT JOIN   socios_dados_pessoais      ON socios_dados_pessoais.socio_id = socios.id
            LEFT JOIN   socios_dados_profissionais ON socios_dados_profissionais.socio_id = socios.id
            LEFT JOIN   sorteio_participantes 
                   ON   sorteio_participantes.socio_id   = socios.id
                  AND   sorteio_participantes.sorteio_id = ?
            WHERE socios.slug = ?
        `, [sorteio_id, socio.getSlug()], (err, result) => {

            if(err) return response(res).error(500, 'Ocorreu um erro ao tentar inscreve-lo')
            if(result.length == 0) return response(res).error(404, 'socio not found')
            if(result[0].diretor == 1) return response(res).error(400, 'Diretores não podem ser inscritos em sorteios')

            const socio_id = result[0].socio_id
            const partc_id = result[0].participante_id
            const pesso_id = result[0].dados_pessoais_id
            const proff_id = result[0].dados_profissionais_id

            if(pesso_id == null || proff_id == null)
                return response(res).error(405, 'Você precisa cadastrar todas as suas informações para participar do sorteio.')  

            if(partc_id != null) return response(res).error(403, 'Sócio já está inscrito') 

            conn.query(`SELECT header FROM user_devices WHERE user_id = ? ORDER BY id DESC LIMIT 1`, [req.user.getId()], (err2, result2) => {
                    
                if(err2) return response(res).error(500, err2.message)
                
                conn.query(`SELECT tipo FROM sorteios WHERE id = ?`, [sorteio_id], (err3, result3) => {

                    if(err3) return response(res).error(500, err3?.message)

                    if(result3[0].tipo != 'todos' && result2[0].header != result3[0].tipo){
                        return response(res).error(400, `Apenas aparelhos '${result3[0].tipo}' podem se inscrever neste sorteio`)
                    }
    
                    conn.query(`
                        INSERT INTO sorteio_participantes (sorteio_id, socio_id)
                        VALUES (?,?)
                    `, [sorteio_id, socio_id], err4 => {
    
                        if(err4) return response(res).error(500, err4.message)
    
                        response(res).success()
    
                    })

                })

            })
                
        });

    }

    public static get_vencedores(req:Request, res:Response){

        if(!req.params.sorteio_id) return response(res).error(400, 'bad request')
        
        const conn = mysqli();
        conn.query(`
          SELECT 
                    socios.id as socio_id,
                    socios.slug,
                    socios.nome,
                    socios.sobrenome,
                    sorteio_participantes.vencedor

             FROM   sorteio_participantes
             JOIN   socios ON sorteio_participantes.socio_id = socios.id
             JOIN   sorteios ON sorteios.id = sorteio_participantes.sorteio_id
            WHERE   sorteios.id = ? AND sorteio_participantes.vencedor = 1
        `, [Number(req.params.sorteio_id)], (err, result) => { 

            if(err) return response(res).error(500, err)
            if(result.length == 0) return response(res).error(404, 'not found');
            
            response(res).success(result)
        
        })

    }

    public static get_participantes(req:Request, res:Response){

        if(!req.params.sorteio_id) return response(res).error(400, 'bad request')
        
        const conn = mysqli();
        conn.query(`
          SELECT 
                    socios.nome,
                    socios.sobrenome,
                    sorteio_participantes.vencedor

             FROM   sorteio_participantes
             JOIN   socios ON sorteio_participantes.socio_id = socios.id
             JOIN   sorteios ON sorteios.id = sorteio_participantes.sorteio_id
            WHERE   sorteios.id = ? AND socios.ghost = 0
        `, [Number(req.params.sorteio_id)], (err, result) => { 

            if(err) return response(res).error(500, err)
            if(result.length == 0) return response(res).error(404, 'not found');
            
            response(res).success(result)
        
        })

    }

    private static list_filtered(user:User, tipo:string, conn:Pool, res:Response){
        
        tipo = tipo != "" ? ` AND (sorteios.tipo = 'todos' OR sorteios.tipo = '${tipo}') ` : '';

        conn.query(`
            SELECT 
                sorteios.id as sorteio_id,
                sorteios.titulo,
                sorteios.premios,
                sorteios.qt_vencedores,
                sorteios.data_sorteio,
                sorteios.ativo,
                sp.status_sorteio
            FROM   sorteios

            LEFT JOIN(
                SELECT 
                    sorteio_participantes.sorteio_id,
                    (CASE 
                        WHEN sorteio_participantes.id IS NULL THEN 0
                        WHEN sorteio_participantes.vencedor > 0 THEN 2
                        ELSE 1
                    END)  as status_sorteio
                FROM   sorteio_participantes 
                JOIN   socios ON sorteio_participantes.socio_id = socios.id  
                JOIN   user   ON user.socio_id = socios.id
                WHERE  user.id = ?
            ) as sp ON sp.sorteio_id = sorteios.id 

            WHERE sorteios.ativo > 0 ${tipo}
            ORDER BY 
                sorteios.id DESC,
                (
                    CASE 
                        WHEN sorteios.ativo = 1
                            THEN sorteios.data_sorteio
                    END
                ) ASC,
                (
                    CASE 
                        WHEN sorteios.ativo = 2
                            THEN sorteios.data_sorteio
                    END
                ) DESC

            ;

        `, [user.getId()], (err, result) => {

            if(err) return response(res).error(500, err)
            if(result.length == 0) return response(res).success([]);

            const sorteios:SorteioSocio[] = [];

            for (let i = 0; i < result.length; i++) {
                const data = dateFormat(new Date(result[i].data_sorteio), 'yyyy-MM-dd H:i:s')            
                const sorteio:SorteioSocio = result[i];
                sorteio.data     = data
                sorteio.inscrito = result[i].status_sorteio != null && result[i].status_sorteio > 0;
                sorteio.vencedor = result[i].status_sorteio != null && result[i].status_sorteio == 2;
                sorteios.push(sorteio)
            }
            
            response(res).success(sorteios);
            
        })

    }

    public static list(req:Request, res:Response){

        const conn  = mysqli();
        
        if(req.user instanceof Socio){
            conn.query(`SELECT header FROM user_devices WHERE user_id = ? ORDER BY id DESC LIMIT 1`, [req.user.getId()], (err, resp) => {
                if(err) return response(res).error(500, err)
                if(resp.length == 0) return response(res).error(404, 'Aparelho não encontrado')
                return SorteioService.list_filtered(req.user, resp[0].header, conn, res)
            })
        } else {
            SorteioService.list_filtered(req.user, '', conn, res)
        }
        
    }

    public static get_sorteio(req:Request, res:Response){

        if(!req.params.sorteio_id) return response(res).error(400, 'bad request')

        const conn = mysqli();
        conn.query(`
          SELECT 
                    sorteios.ativo,
                    sorteios.id,
                    sorteios.titulo,
                    sorteios.premios,
                    sorteios.qt_vencedores,
                    sorteios.data_sorteio,
                    sorteios.data_inscricao

             FROM   sorteios 
            WHERE   id = ?

        `, [Number(req.params.sorteio_id)], (err, result) => { 
            
            if(err) return response(res).error(500, err)
            if(result.length == 0) return response(res).error(404, 'not found');

            const data = dateFormat(new Date(result[0].data_sorteio), 'yyyy-MM-dd H:i:s')  
            const data_inp = dateFormat(new Date(result[0].data_sorteio), 'yyyy-MM-dd')  
            const data_insc = dateFormat(new Date(result[0].data_inscricao), 'yyyy-MM-dd')           
            result[0]['data'] = data
            result[0]['data_br'] = data_inp
            result[0]['data_insc'] = data_insc
            
            response(res).success(result)

        })

    }

    private static get_last_filtered(tipo:string, conn:Pool, res:Response){

        tipo = tipo != "" ? ` AND (sorteios.tipo = 'todos' OR sorteios.tipo = '${tipo}') ` : '';

        conn.query(`
          SELECT 
                    sorteios.id,
                    sorteios.titulo,
                    sorteios.premios,
                    sorteios.qt_vencedores,
                    sorteios.data_sorteio

             FROM   sorteios 
            WHERE   ativo = 1 ${tipo}
         ORDER BY   id DESC LIMIT 1

        `, (err, result) => {

            if(err) return response(res).error(500, err)
            if(result.length == 0) return response(res).success([]);

            const data = dateFormat(new Date(result[0].data_sorteio), 'yyyy-MM-dd H:i:s')            
            result[0]['data'] = data;
            response(res).success(result[0]);

        })
        
    }

    public static get_last(req:Request, res:Response){

        const conn  = mysqli();
        
        if(req.user instanceof Socio){
            conn.query(`SELECT header FROM user_devices WHERE user_id = ? ORDER BY id DESC LIMIT 1`, [req.user.getId()], (err, resp) => {
                if(err) return response(res).error(500, err)
                if(resp.length == 0) return response(res).error(404, 'Aparelho não encontrado')
                return SorteioService.get_last_filtered(resp[0].header, conn, res)
            })
        } else {
            SorteioService.get_last_filtered('', conn, res)
        }
        
    }

    private static get_last_ativo_by_user_filtered(user:User, tipo:string, conn:Pool, res:Response){

        tipo = tipo != "" ? ` AND (sorteios.tipo = 'todos' OR sorteios.tipo = '${tipo}') ` : '';

        conn.query(`
          SELECT 
                    sorteios.id,
                    sorteios.titulo,
                    sorteios.premios,
                    sorteios.qt_vencedores,
                    sorteios.data_sorteio

             FROM   sorteios 
            WHERE   ativo = 1 ${tipo}
         ORDER BY   id DESC LIMIT 1

        `, (err, result) => {

            if(err) return response(res).error(500, err)
            if(result.length == 0) return response(res).success([]);

            const data = dateFormat(new Date(result[0].data_sorteio), 'yyyy-MM-dd H:i:s')            
            const sorteio:SorteioSocio = result[0];
            
            sorteio.data     = data
            sorteio.inscrito = false;
            sorteio.vencedor = false;
            
            conn.query(`
              SELECT 
                       sorteio_participantes.id,
                       sorteio_participantes.vencedor

                FROM   sorteios
                JOIN   sorteio_participantes ON sorteio_participantes.sorteio_id = sorteios.id
                JOIN   socios ON sorteio_participantes.socio_id = socios.id  
                JOIN   user   ON user.socio_id = socios.id
              
               WHERE   user.id = ?
                 AND   sorteios.id = ?
            `, [user.getId(), sorteio.id], (err2, result2) => {
                
                if(err2) return response(res).error(500, err2)
                if(result2.length == 0) return response(res).success(sorteio);

                sorteio.vencedor = result2[0].vencedor == 1
                sorteio.inscrito = result2[0].id != null
                
                response(res).success(sorteio);

            })
            
        })

    }
    
    public static get_last_ativo_by_user(req:Request, res:Response){
        
        const conn  = mysqli();
        
        if(req.user instanceof Socio){
            conn.query(`SELECT header FROM user_devices WHERE user_id = ? ORDER BY id DESC LIMIT 1`, [req.user.getId()], (err, resp) => {
                if(err) return response(res).error(500, err)
                if(resp.length == 0) return response(res).error(404, 'Aparelho não encontrado')
                return SorteioService.get_last_ativo_by_user_filtered(req.user, resp[0].header, conn, res)
            })
        } else {
            SorteioService.get_last_ativo_by_user_filtered(req.user, '', conn, res)
        }

    }

}

export default SorteioService;