import Config from "./lib/config"
import { readFileSync, writeFileSync } from 'fs';
import { hashPass } from './lib/jwt';
import mysqli from './lib/mysqli';
import { join } from 'path';

const config:Config = Config.instance()

async function setAdminMaster(){
    let adminBuff:Buffer = readFileSync(join(__dirname, `../admin.${config.type()}.json`))
    let admin = JSON.parse(adminBuff.toString())
    let pass:String = await hashPass(admin.pass)
    try {
        let conn = mysqli()
        conn.query("INSERT INTO user (email, senha) VALUES (?,?)", [admin.login, pass], (err, result) => {
            if(err) {
                console.log(err)
                return false
            }
            let lastId = result.insertId
            conn.query("INSERT INTO admin (nome, user_id, slug) VALUES ('Master', ?, 'admin-master')", [lastId], err => {
                if(err) {
                    console.log(err)
                    return false
                }
                return true
            })
        })
    } catch(e){
        console.log(e);
        return false;
    }
}

const setup:string = 
`{
    "type":"${config.type()}",
    "config":true
}`

async function init(){
    
    if(config.hasConfig()){   
       return; 
    }

    await setAdminMaster()

    try {
        writeFileSync(join(__dirname, `../config.json`), setup)
    } catch (e) {
        console.log(e)
    }
}

export default init