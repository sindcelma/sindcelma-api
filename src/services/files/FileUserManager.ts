import { Request, Response } from 'express'
import response from '../../lib/response';
import assertion from "../../lib/assertion";
import Config from "../../lib/config";

import Jimp from 'jimp';


class FileUserManager {

    public static async create_ghost(req:Request, res:Response){
        
        try {
            assertion()
            .isSocio(req.user)
            .assert()
        } catch(e){
            return response(res).error(401, 'Unauthorized')
        }

        const ext     = req.body.ext;
        const dir     = req.body.type == null || req.body.type == 'fav' ? "nodoc" : req.body.type ;

        if(!ext) return response(res).error(400, 'Bad Request')


        const urlAssets = Config.instance().json().asset

        try {

            const resp = await fetch(urlAssets+'/api/admin_file/create', {
                method: 'POST', 
                body: JSON.stringify({
                    pair:Config.instance().getPair(),
                    ext:ext,
                    dir:'images/'+dir,
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
            .isSocio(req.user)
            .assert()
        } catch(e){
            return response(res).error(401, 'Unauthorized')
        }
        
        const data = req.body.data;
        const slug = req.body.slug;
        const ext  = req.body.ext;
        const dir  = req.body.dir == null || req.body.dir == 'fav' ? "nodoc" : req.body.dir ;

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
                    dir:'images/'+dir,
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
            .isSocio(req.user)
            .assert()
        } catch(e){
            return response(res).error(401, 'Unauthorized')
        }

        const slug = req.body.slug;
        const ext  = req.body.ext;
        const dir  = req.body.dir == null || req.body.dir == 'fav' ? "nodoc" : req.body.dir ;
        console.log(dir);
        
        if(!slug || !ext || !dir){
            return response(res).error(400, 'Bad Request')
        }

        const urlAssets = Config.instance().json().asset
        
        try {

            const resp1 = await fetch(urlAssets+'/api/admin_file/commit', {
                method: 'POST', 
                body: JSON.stringify({
                    pair:Config.instance().getPair(),
                    ext:ext,
                    dir:'images/'+dir,
                    to: dir == 'nodoc' ? 'images/fav/' : '',
                    copy: dir == 'nodoc' ? req.user.getEmail() : '',
                    slug: slug
                })
            })

            const body = await resp1.json()
            if(body.code != 200){
                return response(res).error(body.code, body.message)
            }
            
            response(res).success(body.message)
        
        } catch (e) {
            response(res).error(500, e)
        }

    }

    static __save_fav_jpg(path:string, to:string){

        Jimp.read(path)
        .then(file => {
            return file
            .quality(60) // set JPEG quality
            .write(to); // save
        })
        .catch(err => {
            console.error(err);
        });

    }

}

export default FileUserManager;