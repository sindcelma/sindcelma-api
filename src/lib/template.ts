import { readFileSync } from "fs";
import { join } from 'path'
import Config from "./config";

function genHtml(content:string, vars:{[k: string]: any}){
    
    content  = content.replace(/\$\{asset\}/gi, Config.instance().json().asset)
    content  = content.replace(/\$\{url\}/gi, Config.instance().json().url)
    
    let keys = Object.keys(vars)
        
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const res = `\\$\\{${key}\\}`
        let reg   = RegExp(res, 'gi')
        content   = content.replace(reg, vars[key])
    }

    return content;
}


class Template {

    private textContent = '';

    constructor(file:string = ''){
        if(file != '')
        this.textContent = readFileSync(join(__dirname, `../${file}`)).toString(); 
    }

    public setTemplate(template:string){
        this.textContent = template
        return this
    }

    public content(){
        return this.textContent
    }

    public replace(vars:{[k: string]: any} = {}){
        this.textContent = genHtml(this.textContent, vars)
        return this
    }

}


export default Template