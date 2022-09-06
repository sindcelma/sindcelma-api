import { Request, Response } from "express";
import User from "./User";

export default async function(req:Request, res:Response, next?:any){
    req.user = new User(String(req.query.email))
    next()
}