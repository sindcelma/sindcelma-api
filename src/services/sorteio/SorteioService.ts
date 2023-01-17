import { Request, Response } from 'express';
import mysqli from '../../lib/mysqli';
import response from '../../lib/response';
import assertion from "../../lib/assertion";
import Socio from '../../model/Socio';
import { dateFormat } from '../../lib/data';

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

        const socio:Socio = <Socio>req.user
        const conn = mysqli();
       
        conn.query(`
            SELECT
                id
            FROM socios 
            WHERE slug = ?
        `, [socio.getSlug()], (err, result) => {

            if(err) return response(res).error(500, err)
            if(result.length == 0) return response(res).error(404, 'socio not found')

            const socio_id = result[0].id
            const sorteio_id = Number(req.body.sorteio_id)
           
            
            conn.query(`
                SELECT 
                      sorteios.id
                FROM  sorteios
                WHERE sorteios.id = ? 
            `, [sorteio_id], (err2, result2) => {

                if(err2) return response(res).error(500, err2)
                if(result2.length == 0) return response(res).error(404, 'not found')

                conn.query(`
                    SELECT 
                            sorteio_participantes.id

                     FROM   sorteio_participantes
                     JOIN   socios ON sorteio_participantes.socio_id = socios.id
                     JOIN   sorteios ON sorteios.id = sorteio_participantes.sorteio_id

                    WHERE   sorteios.id = ? AND sorteio_participantes.socio_id = ?
                `, [sorteio_id, socio_id], (err3, result3) => {

                    if(err3) return response(res).error(500, err3)
                    if(result3.length > 0) return response(res).error(500, 'Você já está incrito neste sorteio')

                    conn.query(`
                        INSERT INTO sorteio_participantes (sorteio_id, socio_id)
                        VALUES (?,?)
                    `, [sorteio_id, socio_id], err4 => {

                        if(err4) return response(res).error(500, err4)

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
            WHERE   sorteios.id = ?
        `, [Number(req.params.sorteio_id)], (err, result) => { 

            if(err) return response(res).error(500, err)
            if(result.length == 0) return response(res).error(404, 'not found');
            
            response(res).success(result)
        
        })

    }

    public static list(req:Request, res:Response){

        const conn = mysqli();
        
        conn.query(`
            SELECT 
                sorteios.id as sorteio_id,
                sorteios.titulo,
                sorteios.premios,
                sorteios.qt_vencedores,
                sorteios.data_sorteio,
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
                WHERE  user.id = 54
                
            ) as sp ON sp.sorteio_id = sorteios.id 
            ORDER BY 
                sorteios.ativo DESC,
                (
                    CASE 
                        WHEN sorteios.ativo = 1
                            THEN sorteios.data_sorteio
                    END
                ) ASC,
                (
                    CASE 
                        WHEN sorteios.ativo = 0
                            THEN sorteios.data_sorteio
                    END
                ) DESC

            ;

        `, [req.user.getId()], (err, result) => {

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

    public static get_sorteio(req:Request, res:Response){

        if(!req.params.sorteio_id) return response(res).error(400, 'bad request')
        
        const conn = mysqli();
        conn.query(`
          SELECT 
                    sorteios.id,
                    sorteios.titulo,
                    sorteios.premios,
                    sorteios.qt_vencedores,
                    sorteios.data_sorteio

             FROM   sorteios 
            WHERE   id = ?

        `, [Number(req.params.sorteio_id)], (err, result) => { 
            
            if(err) return response(res).error(500, err)
            if(result.length == 0) return response(res).error(404, 'not found');

            const data = dateFormat(new Date(result[0].data_sorteio), 'yyyy-MM-dd H:i:s')            
            result[0]['data'] = data
            
            response(res).success(result)

        })

    }

    public static get_last(req:Request, res:Response){

        const conn = mysqli();
        conn.query(`
          SELECT 
                    sorteios.id,
                    sorteios.titulo,
                    sorteios.premios,
                    sorteios.qt_vencedores,
                    sorteios.data_sorteio

             FROM   sorteios 
            WHERE   ativo = 1
         ORDER BY   id DESC LIMIT 1

        `, (err, result) => {

            if(err) return response(res).error(500, err)
            if(result.length == 0) return response(res).success([]);

            const data = dateFormat(new Date(result[0].data_sorteio), 'yyyy-MM-dd H:i:s')            
            result[0]['data'] = data;
            response(res).success(result[0]);

        })

    }

    
    public static get_last_ativo_by_user(req:Request, res:Response){
        
        const conn = mysqli();
        conn.query(`
          SELECT 
                    sorteios.id,
                    sorteios.titulo,
                    sorteios.premios,
                    sorteios.qt_vencedores,
                    sorteios.data_sorteio

             FROM   sorteios 
            WHERE   ativo = 1
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
            `, [req.user.getId(), sorteio.id], (err2, result2) => {
                
                if(err2) return response(res).error(500, err2)
                if(result2.length == 0) return response(res).success(sorteio);

                sorteio.vencedor = result2[0].vencedor == 1
                sorteio.inscrito = result2[0].id != null
                

                response(res).success(sorteio);

            })
            
        })

    }

}

export default SorteioService;