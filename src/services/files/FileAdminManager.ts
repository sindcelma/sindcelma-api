import { Request, Response } from "express";
import fetch from 'node-fetch';
import assertion from "../../lib/assertion";
import response from "../../lib/response";
import {  appendFileSync, writeFileSync, renameSync } from 'fs';
import { join } from 'path';
import { generateSlug } from '../../lib/jwt'
import Config from "../../lib/config";

class FileAdminManager {

    public static async generateCSV(req:Request, res:Response){

        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch(e){
            return response(res).error(401, 'Unauthorized')
        }

        if(!req.body.data || req.body.data.lenght < 2) return response(res).error(400, 'Bad Request')

        const urlAssets = Config.instance().json().asset

        try {

            let vars = []
            vars.push(Object.keys(req.body.data[0]))

            for (let i = 0; i < req.body.data.length; i++) {
                const obj =  req.body.data[i];
                vars.push(Object.values(obj))
            }

            const resp = await fetch(urlAssets+'/api/generator_file/csv', {
                method: 'POST', 
                body: JSON.stringify({
                    pair:Config.instance().getPair(),
                    vars:vars,
                    name:req.body.name
                })
            })

            const body = await resp.json()
            if(body.code != 200){
                return response(res).error(body.code, body.message)
            }
            response(res).success({
                file: urlAssets+'/file/'+body.message
            })

        } catch (error) {
            response(res).error(500, 'Erro ao tentar gerar o arquivo')            
        }

    }

    public static create_ghost(req:Request, res:Response){
        
        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch(e){
            return response(res).error(401, 'Unauthorized')
        }

        const ext  = req.body.ext;
        const dir  = req.body.dir;
        if(!ext || !dir) return response(res).error(400, 'Bad Request')
        
        const slug    = generateSlug(`${req.user.getId()}${Date()}`);
        const fileStr = `../../public/${dir}/${slug}.${ext}.ghost`;
        const file    = join(__dirname, fileStr);

        try {
            writeFileSync(file, "", {
                flag: 'w',
            })
            response(res).success({
                slug:slug
            })
        } catch (e) {
            response(res).error(500, e)
        }

    }

    public static append(req:Request, res:Response){
        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch(e){
            return response(res).error(401, 'Unauthorized')
        }

        const data = req.body.data;
        const slug = req.body.slug;
        const ext  = req.body.ext;
        const dir  = req.body.dir;

        if(!slug || !ext || !dir){
            return response(res).error(400, 'Bad Request')
        }

        try {
            const buff    = Buffer.from(data, "base64")
            const fileStr = `../../public/${dir}/${slug}.${ext}.ghost`;
            const file    = join(__dirname, fileStr);
            appendFileSync(file, buff)
            response(res).success()
        } catch (e) {
            response(res).error(500, 'Este arquivo não existe ou os dados enviados estão incorretos')
        }

    }

    public static commit(req:Request, res:Response){
        try {
            assertion()
            .isAdmin(req.user)
            .assert()
        } catch(e){
            return response(res).error(401, 'Unauthorized')
        }

        const slug = req.body.slug;
        const ext  = req.body.ext;
        const dir  = req.body.dir;

        if(!slug || !ext || !dir){
            return response(res).error(400, 'Bad Request')
        }

        const newF = `../../public/${dir}/${slug}.${ext}`;
        const oldF = `${newF}.ghost`;
        const fileN   = join(__dirname, newF);
        const fileO   = join(__dirname, oldF);
        
        try {
            renameSync(fileO, fileN)
            const img = `${Config.instance().json().url+dir}/${slug}.${ext}`;
            response(res).success(img)
        } catch (e) {
            response(res).error(404, 'Este arquivo não existe')
        }

    }

}

export default FileAdminManager