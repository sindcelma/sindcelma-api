import { Request, Response } from 'express'
import mysqli from '../../lib/mysqli'
import { generateSlug } from '../../lib/jwt'
import {  appendFileSync, copyFileSync, writeFileSync, renameSync } from 'fs';
import { join } from 'path';
import response from '../../lib/response';

import Jimp from 'jimp';


class FileUserManager {

    public static create_ghost(req:Request, res:Response){
        
        const user_id = req.user.getId();
        const ext     = req.body.ext;
        const type    = req.body.type != null ? req.body.type : "fav";

        if(!ext || !type) return response(res).error(400, 'Bad Request')

        const slug = generateSlug(`${user_id}${Date()}`)+`_${type}`;
        
        const conn = mysqli()
        conn.query("INSERT INTO user_images (user_id, slug, type, ext) VALUES (?,?,?,?)", 
            [user_id, slug, type, ext], err => {
            
            if(err) return response(res).error(500, err.message);
            const fileStr = `../../public/images/${type}/${slug}.${ext}.ghost`;
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

        })
        

    }

    public static append(req:Request, res:Response){
        
        const user_id = req.user.getId();
        const data    = req.body.data;
        const slug    = req.body.slug;

        if(!data || !slug) return response(res).error(400, 'Bad Request')

        const conn = mysqli();

        conn.query("SELECT ext, user_id, type FROM user_images WHERE slug = ? AND ativo = 0", [slug], (err, result) => {
            
            if(err) return response(res).error(500, 'Internal Error')
            if(result.length == 0) return response(res).error()

            const fileSel = result[0];
            if(fileSel.user_id != user_id) return response(res).error(401, 'Unauthorized')
            
            const buff    =  Buffer.from(data, "base64")
            const fileStr = `../../public/images/${fileSel.type}/${slug}.${fileSel.ext}.ghost`;
            const file    = join(__dirname, fileStr);
            
            try {
                appendFileSync(file, buff)
                response(res).success()
            } catch (e) {
                response(res).error(500, 'Este arquivo não existe')
            }
        })

    }


    public static commit(req:Request, res:Response){

        const user_id = req.user.getId();
        const email   = req.user.getEmail();
        const slug    = req.body.slug;

        if(!slug) return response(res).error(400, 'Bad Request')

        const conn = mysqli();
        conn.query("SELECT ext, user_id, type FROM user_images WHERE slug = ? AND ativo = 0", [slug], (err, result) => {
            
            if(err) return response(res).error(500, 'Internal Error 1')
            if(result.length == 0) return response(res).error()
            
            const fileSel = result[0];
            if(fileSel.user_id != user_id) return response(res).error(401, 'Unauthorized')
            
            const newF    = `../../public/images/${fileSel.type}/${slug}.${fileSel.ext}`;
            const oldF    = `${newF}.ghost`;
            const fileN   = join(__dirname, newF);
            const fileO   = join(__dirname, oldF);
            
            try {

                renameSync(fileO, fileN)
                
                if(fileSel.type == 'nodoc' || fileSel.type == 'fav'){
                    let fileFav   = `../../public/images/fav/${email}.${fileSel.ext}`
                    const copy    = join(__dirname, fileFav)
                    copyFileSync(fileN, copy)
                    if(fileSel.ext != "jpg"){
                        let to = `../../public/images/fav/${email}.jpg`
                        FileUserManager.__save_fav_jpg(copy, to)
                    }
                }

                conn.query("UPDATE user_images SET ativo = 1 WHERE slug = ?", [slug], err => {
                    if(err) return response(res).error(500, 'Internal Error 1')
                    response(res).success()
                })

                
            } catch (e) {
                response(res).error(404, 'Este arquivo não existe')
            }

        })


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