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

    public static async create_ghost(req:Request, res:Response){
        
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

        const urlAssets = Config.instance().json().asset

        try {

            const resp = await fetch(urlAssets+'/api/admin_file/create', {
                method: 'POST', 
                body: JSON.stringify({
                    pair:Config.instance().getPair(),
                    ext:ext,
                    dir:dir,
                    salt:req.user.getId()
                })
            })

            const body = await resp.json()

            if(body.code != 200){
                return response(res).error(body.code, body.message)
            }
            
            response(res).success({
                slug: body.message.slug
            })
        
        } catch (e) {
            response(res).error(500, e)
        }

    }

    public static async append(req:Request, res:Response){

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

        const urlAssets = Config.instance().json().asset
        
        try {

            const resp = await fetch(urlAssets+'/api/admin_file/append', {
                method: 'POST', 
                body: JSON.stringify({
                    pair:Config.instance().getPair(),
                    ext:ext,
                    dir:dir,
                    data:data,
                    slug:slug
                })
            })

            const body = await resp.json()

            if(body.code != 200){
                return response(res).error(body.code, body.message)
            }
            
            response(res).success()
        
        } catch (e) {
            response(res).error(500, e)
        }

    }

    public static async commit(req:Request, res:Response){
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

        const urlAssets = Config.instance().json().asset
        
        try {

            const resp = await fetch(urlAssets+'/api/admin_file/commit', {
                method: 'POST', 
                body: JSON.stringify({
                    pair:Config.instance().getPair(),
                    ext:ext,
                    dir:dir,
                    slug:slug
                })
            })

            const body = await resp.json()
            if(body.code != 200){
                return response(res).error(body.code, body.message)
            }
            
            response(res).success(body.message)
        
        } catch (e) {
            response(res).error(500, e)
        }

    }

}

export default FileAdminManager