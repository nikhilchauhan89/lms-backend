import { imageModel } from "../model/model.js"
import jwt from "jsonwebtoken";



const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token
    console.log(token)
    if (!token) {
      return res.send({ message: "unauthorized:No token provide" })
    }
    const decoded = jwt.verify(token, "Google")
    const user = await imageModel.findById(decoded.id);

    if (user.role !== 'admin') {
      res.send({ success: false, message: "unauthorized: user is not an admin" })
    }
    req.user = user; 
    next();

 
  } catch (error) {
    console.log("login error", error)
    return res.send({ success: false, message: "internal server error " })
  }
}
export default isAdmin