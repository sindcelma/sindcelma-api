import crypto from 'crypto'
import Config from './config'

const config:Config = Config.instance()

interface header {
    alg:string,
    typ?:string,
    tim?:number
}

export default {

    gen: function(body:{}){
        
        const limit = Date.now() + (1000 * 60 * 60)  // uma hora de duração
        
        const header:header = {
            alg:"sha256",
            tim: limit
        }

        const h = Buffer.from(JSON.stringify(header)).toString('base64')
        const b = Buffer.from(JSON.stringify(body)).toString('base64')
        
        return `${h}.${b}.${crypto.createHmac(header.alg, config.json().salt).update(h+'.'+b).digest('base64')}`
    },

    verify: function(hash:string){

        try {

            const parts  = hash.split('.')
            const header = JSON.parse(Buffer.from(parts[0], 'base64').toString('utf8'))
            
            const agora = Date.now()

            const cripth = Buffer.from(
                crypto.createHmac(header.alg, config.json().salt)
                .update(parts[0]+'.'+parts[1])
                .digest('base64'), 'base64'
            ).toString('ascii')
    
            return (
                cripth
                == Buffer.from(parts[2], 'base64').toString('ascii')
                ?  { data: JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8')), expired: agora > header.tim }
                :  false 
            )
    
        } catch(e){
            return false
        }
        
    }

}