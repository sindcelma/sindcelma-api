import crypto from 'crypto'
import Config from './config'

const config:Config = Config.instance()

interface DataUser {
    id:Number,
    nome:String,
    sobrenome:String,
    email:String,
    ativo:boolean
}

interface Token {
    type:string,
    expired:boolean,
    data:DataUser,
    status:boolean
}

interface header {
    alg:string,
    typ:string,
    tim:number
}

const limit = Date.now() + (1000 * 60 * 60)  // uma hora de duração

const emptyUser:DataUser = {
    id:0,
    nome:'',
    sobrenome:'',
    email:'',
    ativo:false
} 

const visitante:Token = {
    status:false,
    type:"Visitante",
    expired:true,
    data:emptyUser
}


const generateToken = function(type:string, body:any){
        
    const header:header = {
        alg:"sha256",
        tim: limit,
        typ:type
    }

    const h = Buffer.from(JSON.stringify(header)).toString('base64')
    const b = Buffer.from(JSON.stringify(body)).toString('base64')
    
    return `${h}.${b}.${crypto.createHmac(header.alg, config.json().salt).update(h+'.'+b).digest('base64')}`
}


const verifyToken = function(hash:string):Token{

    try {

        const parts  = hash.split('.')
        const header = JSON.parse(Buffer.from(parts[0], 'base64').toString('utf8'))
        const agora = Date.now()

        const cripth = Buffer.from(
            crypto.createHmac(header.alg, config.json().salt)
            .update(parts[0]+'.'+parts[1])
            .digest('base64'), 'base64'
        ).toString('ascii')

        let expired = agora > header.tim
        
        if(expired && (agora - header.tim) > (limit + (1000 * 15))){
            return visitante
        }

        return (
            cripth == Buffer.from(parts[2], 'base64').toString('ascii')
            ?  { 
                    status: true, 
                    type:header.typ,
                    data: JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8')), 
                    expired: expired
                }
            :  visitante
        )

    } catch(e){
        return visitante
    }
    
}

export {
    Token,
    DataUser,
    generateToken,
    verifyToken
}