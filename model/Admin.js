import isAdmin from "../middleware/isAdmin.js";
import { imageModel } from "./model.js"
import express from 'express';

const AdminRoutes = express.Router()
AdminRoutes.get('/getallusers',isAdmin,async(req,res)=>{
  try {
    const users = await imageModel.find()
    if(!users){
        res.send({success:false,message:"No user found"})
    }
    return res.send({success:true,users})
  } catch (error) {
    console.log("login error",error)
    return res.send({success:false,message:'internal server error'})
  }
})

export default AdminRoutes