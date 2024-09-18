import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { User } from '../model/userModel'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {


        const { username, email, password } = req.body;

        const dbEmail = await User.findOne({ email: email })


        if (dbEmail) {
            res.status(500).json({ message: "Email already exists!" });
        } else {
            console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%55');
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({ username, email, password: hashedPassword });

            await newUser.save();

            res.status(201).json({ message: 'Your account has been successfully created. Please log in now.', username, email });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const userData = await User.findOne({ email: email });

        if (userData) {
            const passMatch = await bcrypt.compare(password, userData.password);

            if (passMatch) {
                if (userData.isAdmin) {
                    
                    const token = jwt.sign({ email: userData.email, userId: userData._id, isAdmin: true }, 'mysecretkey', { expiresIn: "75h" });
                    res.status(201).json({ userId: userData._id, email: userData.email, token: token, isAdmin: true, username: userData.username });
                } else {

                    const token = jwt.sign({ email: userData.email, userId: userData._id, isAdmin: false }, 'mysecretkey', { expiresIn: "75h" });
                    res.status(201).json({ userId: userData._id, email: userData.email, token: token, isAdmin: false, username: userData.username });
                }
            } else {
                res.status(500).json({ message: "Incorrect Credentials!!!!" });
            }
        } else {
            res.status(500).json({ message: "Incorrect Credentials!" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const imagedisplay = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId
        console.log(userId + '+++++===');

        const userData = await User.findOne({ _id: userId })

        if (userData) {
            const userName = userData.username
            const imgFileName = userData.image;
            res.json({userName, url: imgFileName });
        } else {
            res.status(500).json({ message: "User Not Found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const profileUpload = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId
        console.log(userId);
        
        console.log(process.env.CLOUDINARY_API_KEY,'()()()()()()()()()()');       
        
        if (req.file) {
            const filePath = req.file?.path;

            const uploadOptions = {
                transformation: {
                    width: 300,  
                    height: 300, 
                    crop: 'fill' 
                }
            };
            console.log(filePath);
            const uploadedImage = await cloudinary.uploader.upload(filePath, uploadOptions);

            const userData = await User.findById(userId)
            if (userData) {
                console.log('5678u9i0o');
                
                userData.image = uploadedImage.secure_url;
                await userData.save();
                res.json({ imagePath: uploadedImage.secure_url });
            } else {
                res.status(500).json({ message: "User Not found Or Internal Server Error" });
            }
        } else {
            res.status(500).json({ message: "Image Not found Try again" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}