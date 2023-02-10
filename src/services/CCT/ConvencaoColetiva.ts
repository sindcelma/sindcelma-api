import { Request, Response } from 'express';
import mysqli from '../../lib/mysqli';
import response from '../../lib/response';
import assertion from "../../lib/assertion";


class ConvencaoColetiva {

    public static save_fav(req:Request, res:Response){

        const item_id = req.body.item_id
        
        if(!item_id) return response(res).error(400, 'bad request')

        try {
            assertion()
            .isSocio(req.user)
            .assert()
        } catch (error) {
            return response(res).error(401, 'Unauthorized')
        }

        const conn = mysqli()

        conn.query(`
          SELECT
                 socios.id
            FROM socios 
            JOIN user ON user.socio_id = socios.id 
           WHERE user.id = ?
        `, [req.user.getId()], (err, result) => {
            
            if(err) return response(res).error(500, 'server error 1')
            if(result.length == 0) return response(res).error(404, 'socio nao encontrado')
            
            const socio_id = result[0].id

            conn.query('SELECT id FROM cct_item_fav WHERE cct_item_id = ? AND socio_id = ?', 
                [item_id, socio_id], (err2, result2) => {
                    
                    if(err2) return response(res).error(500, 'server error 2')
                    if(result2.length > 0) {

                        const id_fav = result2[0].id;
                        
                        conn.query(`
                            DELETE FROM cct_item_fav WHERE id = ?
                        `, [id_fav], err3 => {
                            
                            if(err3) return response(res).error(500, 'Erro ao tentar salvar')

                            response(res).success()

                        })

                    } else {
                        conn.query(`
                            INSERT INTO cct_item_fav (cct_item_id, socio_id)
                            VALUES (?,?)
                        `, [item_id, socio_id], err3 => {
                            
                            if(err3) return response(res).error(500, 'Erro ao tentar salvar')

                            response(res).success()

                        })
                    }
                    

                })
           

        })

    }

    public static item_detail(req:Request, res:Response){

        const item_id = req.body.item_id
        if(!item_id) return response(res).error(400, 'bad request')

        try {
            assertion()
            .isAdmin(req.user)
            .orIsSocio(req.user)
            .assert()
        } catch (error) {
            return response(res).error(401, 'Unauthorized')
        }


        const conn = mysqli()

        conn.query(`
            SELECT item, imagem, resumo, texto
              FROM cct_item
             WHERE id = ?
        `, [item_id], (err, result) => {

            if(err) return response(res).error(500, 'server error')
            if(result.length == 0) return response(res).error(404, 'not found')

            conn.query(`INSERT INTO cct_stats (cct_item_id, data) VALUES (?,now())`, [item_id])

            response(res).success(result)

        })

    }

    public static list_itens_by_search(req:Request, res:Response){

        const search = req.body.search;
        const cct_id = req.body.cct_id;

        if(!search || !cct_id) return response(res).error(400, 'bad request')

        try {
            assertion()
            .isAdmin(req.user)
            .orIsSocio(req.user)
            .assert()
        } catch (error) {
            return response(res).error(401, 'Unauthorized')
        }

        let q:string = `
              SELECT 
                      id, item, resumo, 0 as fav
                FROM  cct_item 
               WHERE 
                  (   item   LIKE ?
                  OR  resumo LIKE ?
                  OR  texto  LIKE ? )
                 AND  cct_id = ?
        `;

        mysqli().query(q, [`%${search}%`, `%${search}%`, `%${search}%`, cct_id], (err, result) => {
            if(err) return response(res).error(500, 'server error')
            response(res).success(result)
        })

    }


    public static itens_by_socio(req:Request, res:Response){

        if(!req.body.cct_id || !req.body.slug) return response(res).error(400, 'bad request')

        try {
            assertion()
            .isAdmin(req.user)
            .orIsSameSocio(req.user, req.body.slug)
            .assert()
        } catch (error) {
            return response(res).error(401, 'Unauthorized')
        }

        const conn = mysqli()

        conn.query(`
            SELECT 
                cct_item.id,
                cct_item.item,
                cct_item.resumo,
                !isnull(c.id) as fav
            FROM cct_item 
            LEFT JOIN (
                SELECT 
                    cct_item_fav.id, cct_item_fav.cct_item_id 
                FROM cct_item_fav 
                JOIN socios ON socios.id = cct_item_fav.socio_id
                WHERE socios.slug = ?
            ) c ON c.cct_item_id = cct_item.id 
            WHERE cct_id = ?
            ORDER BY 
                c.id DESC, cct_item.item ASC;
        `, [ req.body.slug, Number(req.body.cct_id) ], (err, result) => {

            if(err) return response(res).error(500, 'server error')
            response(res).success(result)

        })

    }

    public static get_last_cct(req:Request, res:Response){

        const conn = mysqli()

        conn.query(`
            SELECT 
                id,
                titulo
            FROM  cct 
            WHERE publico = 1
            ORDER BY id DESC LIMIT 1
        `, (err, result) => {
            if(err) return response(res).error(500, err)
            response(res).success(result)
        })

    }
    
    public static list(req:Request, res:Response){

        const conn = mysqli()

        conn.query(`
            SELECT 
                id,
                titulo
            FROM cct 
            WHERE publico = 1
        `, (err, result) => {
            if(err) return response(res).error(500, err)
            response(res).success(result)
        })

    }

}

export default ConvencaoColetiva