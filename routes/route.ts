import express, { Router } from "express";
const router:Router = express.Router()
import * as userController from '../controller/userController'
import { upload } from '../config/multer'
import * as adminController from '../controller/adminController'



router.post('/createUser',userController.createUser)
router.post('/userLogin',userController.login)
router.post('/updateProPic/',upload.single('image'),userController.profileUpload)
router.get('/user-profile/:userId',userController.imagedisplay)


//admin

router.get('/userData',adminController.getAllUser)
router.delete('/deleteUser/:userId',adminController.DeleteUser)
router.post('/editUser/:userId',adminController.editUser)



export default router;
