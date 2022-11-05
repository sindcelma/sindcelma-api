import crypto from 'crypto'
import Config from './config'
import * as bcrypt from 'bcrypt';

const config:Config = Config.instance()

interface DataUser {
    id:Number,
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

const limit = Date.now() + (1000 * 60 * 15)  // 15 minutos de duração

const emptyUser:DataUser = {
    id:0,
    email:'',
    ativo:false
} 

const visitante:Token = {
    status:false,
    type:"Visitante",
    expired:true,
    data:emptyUser
}


const generateToken = function(type:string, body:any):String{
        
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
        
        if(expired && (agora - header.tim) > (1000 * 60 * 15)){
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

const generateCode = function(){
    return Math.random().toString(36).substring(7)
}

const generateSlug = function(content:any){
    return Buffer.from(
        crypto.createHmac('sha256', config.json().salt)
        .update(content)
        .digest('base64'), 'base64'
    ).toString('hex')
}

const hashPass = async function(pass:string) {
    return await bcrypt.hash(pass+config.json().salt, 10);
}

const comparePass = async function(pass:string, hash:string){
    return await bcrypt.compare(pass+config.json().salt, hash);
}

export {
    Token,
    DataUser,
    generateToken,
    verifyToken,
    generateSlug,
    generateCode,
    hashPass,
    comparePass
}