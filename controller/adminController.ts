import { Request,Response } from "express";
import { User } from "../model/userModel";



export const getAllUser = async(req:Request,res:Response) => {
    try {
        const userdata = await User.find({isAdmin:false})
        if (userdata) {
            const users = userdata;
            res.json(users);
        } else {
            res.status(500).json({ message: "Problem in the DataBase" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const DeleteUser = async(req:Request,res:Response) => {
    try {
        const {userId} = req.params
        const userdata = await User.findByIdAndDelete(userId)
        res.json({ userdata });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const editUser = async(req:Request,res:Response) => {
    try {
        const userId = req.params.userId;
        const userData = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });
    
        if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
        }
        
        return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}