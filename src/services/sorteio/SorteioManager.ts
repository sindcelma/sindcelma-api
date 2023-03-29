import { Request, Response } from 'express'
import assertion from '../../lib/assertion'
import mysqli from '../../lib/mysqli'
import response from '../../lib/response'
import { dateFormat } from '../../lib/data'
import firebase from '../../lib/firebase'

class SorteioManager {

    public static changeStatus(req:Request, res:Response){

        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch(e){
            return response(res).error(401, 'Unauthorized')
        }

        const status     = Number(req.body.status)
        const sorteio_id = Number(req.body.sorteio_id)
        
        if(!sorteio_id) return response(res).error(400, 'Bad request')

        const conn = mysqli();

        conn.query(`
            UPDATE sorteios 
            SET ativo = ?
            WHERE id = ?
        `, [status, sorteio_id], err => {

            if(err) return response(res).error(500, err)

            conn.query(`SELECT titulo, tipo FROM sorteios WHERE id = ?`, [sorteio_id], (err, result) => {
                    
                if(err) return response(res).error(500, 'Internal Error')
                
                const titulo = result[0].titulo
                const tipo   = result[0].tipo
                const where  = tipo != "todos" ? `AND header = '${tipo}'` : ''

                if(status == 1){
                    let quryDevices = `
                        SELECT 
                                user_devices.code
                        FROM  socios 
                        JOIN  user         ON user.socio_id = socios.id 
                        JOIN  user_devices ON user.id = user_devices.user_id 
                        WHERE NOT user_devices.code IS null ${where}
                    `;
    
                    conn.query(quryDevices, (err2, result2) => {
    
                        if(err2) return console.log(err2);
    
                        let devices:string[] = []                    
                        for (let i = 0; i < result2.length; i++)
                            devices.push(result2[i].code)
    
                        firebase.sendNotification(`SORTEIO ATIVO!`, titulo, devices)
                    
                    })
                }

            })

            response(res).success()
        })
        
    }

    public static list(req:Request, res:Response){

        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch(e){
            return response(res).error(401, 'Unauthorized')
        }

        const conn = mysqli();
        
        conn.query(`
            SELECT 
                sorteios.id as sorteio_id,
                sorteios.titulo,
                sorteios.premios,
                sorteios.qt_vencedores,
                sorteios.data_sorteio,
                sorteios.ativo
            FROM   sorteios
            ORDER BY 
                sorteios.id DESC

        `, (err, result) => {

            if(err) return response(res).error(500, err)
            if(result.length == 0) return response(res).success([]);

            let sorteios = [];
            
            for (let i = 0; i < result.length; i++) {
                const data       = dateFormat(new Date(result[i].data_sorteio), 'dd-MM-yyyy')            
                const sorteio    = result[i];
                sorteio.data     = data
                sorteios.push(sorteio)
            }
            
            response(res).success(sorteios);
            
        })
        
    }

    public static sortear(req:Request, res:Response){
        
        if(!req.body.sorteio_id) 
            return response(res).error(400, 'Bad Request')

        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch(e){
            return response(res).error(401, 'Unauthorized')
        }

        const conn = mysqli();
        
        conn.query(
            `SELECT 
                    participantes.id,
                    sorteio.qt_vencedores,
                    participantes.socio_id,
                    socio.nome,
                    socio.cpf,
                    socio.id as socio_id
               FROM sorteio_participantes as participantes
               JOIN socios as socio ON participantes.socio_id = socio.id 
               JOIN sorteios as sorteio ON sorteio.id = participantes.sorteio_id 
              WHERE sorteio.id = ? AND sorteio.ativo = 1 AND ghost = 0`, 
        [Number(req.body.sorteio_id)], (err, result) => {
            
            if(err) return response(res).error(500, 'Server Error')
            if(result.length == 0) return response(res).error(404, 'Não é possível realizar o sorteio pois não há participantes suficientes')
            
            let qt_vencedores = Number(result[0].qt_vencedores)
            if(result.length < qt_vencedores) return response(res).error(404, 'Não é possível realizar o sorteio pois não há participantes suficientes')

            var vencedores = []

            while(qt_vencedores > vencedores.length){
                let i  = Math.floor(Math.random() * result.length)
                const vencedor = result.splice(i, 1);
                vencedores.push(vencedor[0])
            }

            let insert = `UPDATE sorteio_participantes SET vencedor = 1 WHERE `;
            for (let z = 0; z < vencedores.length; z++) 
                insert += ` id = ${vencedores[z].id} OR `
            insert = insert.substring(0, insert.length - 3)

            conn.query(insert, err => {
               
                if(err) return response(res).error(500, err)
                
                let listQ  = "";
                for (let i = 0; i < vencedores.length; i++)
                    listQ += ` socios.id = ${vencedores[i].socio_id} OR `
                listQ = listQ.substring(0, listQ.length - 3)

                let quryDevices = `
                    SELECT 
                          user_devices.code
                    FROM  socios 
                    JOIN  user         ON user.socio_id = socios.id 
                    JOIN  user_devices ON user.id = user_devices.user_id 
                    WHERE (${listQ}) AND NOT user_devices.code IS null
                `;

                conn.query(quryDevices, (err2, result2) => {

                    if(err2) console.log(err2);
                    ;

                    let devices:string[] = []                    
                    for (let i = 0; i < result2.length; i++)
                        devices.push(result2[i].code)

                    firebase.sendNotification(`PARABÉNS!`, "Você foi um dos ganhadores do sorteio! Confira!", devices)
                
                })

                response(res).success(vencedores)

            })

        })

    }

    public static add(req:Request, res:Response){

        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch(e){
            return response(res).error(401, 'Unauthorized')
        }

        const titulo  = req.body.titulo,
              premios = req.body.premios,
              tipo    = req.body.tipo,
              qt_venc = Number(req.body.qt_venc),
              data_so = dateFormat(req.body.data_so, 'yyyy-MM-dd H:i:s'),
              data_in = dateFormat(req.body.data_in, 'yyyy-MM-dd H:i:s')
        
        if((new Date(data_so.toString())).getTime() < (new Date(data_in.toString())).getTime())
            return response(res).error(400, 'Bad Request - A data de inscrição não pode ser maior que a data do sorteio')
        
        mysqli().query(`
            INSERT INTO sorteios (tipo, titulo, premios, qt_vencedores, data_sorteio, data_inscricao, ativo)
            VALUES (?,?,?,?,?,?,0)
        `, [tipo, titulo, premios, qt_venc, data_so, data_in], err => {
            if(err) return response(res).error(500, err)
            response(res).success()
        })

    }

    public static update(req:Request, res:Response){

        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch(e){
            return response(res).error(401, 'Unauthorized')
        }

        const titulo    = req.body.titulo,
              tipo      = req.body.tipo,
              premios   = req.body.premios,
              soteio_id = Number(req.body.soteio_id),
              qt_venc   = Number(req.body.qt_venc),
              data_so   = dateFormat(req.body.data_so, 'yyyy-MM-dd H:i:s'),
              data_in   = dateFormat(req.body.data_in, 'yyyy-MM-dd H:i:s')
    
        if((new Date(data_so.toString())).getTime() < (new Date(data_in.toString())).getTime())
            return response(res).error(400, 'Bad Request - A data de inscrição não pode ser maior que a data do sorteio')
          
        mysqli().query(`
            UPDATE sorteios SET 
            tipo = ?,
            titulo = ?,
            premios = ?, 
            qt_vencedores = ?, 
            data_sorteio = ?, 
            data_inscricao = ?
            WHERE id = ?
        `, [tipo, titulo, premios, qt_venc, data_so, data_in, soteio_id], err => {
            if(err) return response(res).error(500, 'Internal Error')
            response(res).success()
        })

    }

    public static publish(req:Request, res:Response){

        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch(e){
            return response(res).error(401, 'Unauthorized')
        }

        let ativo     = Number(req.body.ativo),
            soteio_id = Number(req.body.soteio_id)
        
        if(ativo > 1) ativo = 1

        const conn = mysqli()

        conn.query(`
            UPDATE sorteios SET 
            ativo = ?,
            WHERE id = ?
        `, [ativo, soteio_id], err => {
            if(err) return response(res).error(500, 'Internal Error')

            if(ativo == 1){
                // selecionar os aparelhos e enviar
                conn.query(`SELECT titulo, tipo FROM sorteios WHERE id = ?`, [soteio_id], (err, result) => {
                    
                    if(err) return response(res).error(500, 'Internal Error')
                    
                    const titulo = result[0].titulo
                    const tipo   = result[0].tipo
                    const where  = tipo != "todos" ? `AND header = '${tipo}'` : ''

                    conn.query(`SELECT code FROM user_devices WHERE NOT code IS null ${where}`, (err, resultdevs) => {
                        
                        if(err) return response(res).error(500, 'Internal Error')

                        let devicesCod  = []
                        for (let i = 0; i < resultdevs.length; i++)
                            devicesCod.push(resultdevs[i].code)

                        firebase.sendNotification('Novo Sorteio!', titulo, devicesCod)
                    })

                })

            }
            
            response(res).success()
        })

    }
    
}

export default SorteioManager