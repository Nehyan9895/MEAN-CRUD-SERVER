import multer from 'multer';
import { Request } from "express";

export const storage = multer.diskStorage({
    destination:function (req:Request,file:Express.Multer.File,cb):void {
        cb(null, "uploads/");
    },
    filename:function (req:Request,file:Express.Multer.File,cb) {
        cb(null, Date.now()+'_'+file.originalname);
    },
})


export const imageFilter = (req:Request,file:Express.Multer.File,cb:CallableFunction)=>{
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb((new Error('You can only upload Images')),false) 
    }
    cb(null,true)
}







export const upload = multer({storage:storage,fileFilter:imageFilter})