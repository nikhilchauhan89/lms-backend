import express from "express"
import multer from "multer";
import { createAddress, createRegister, createSlider, createUser, createUserDetails, deleteUser, form, generateCertificate, getProgress, getSlider, getUser, getUserAdress, loginRegister, progress, updateCourse, updateUser, userRegister } from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const router = express.Router()



const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage })

router.get("/", form);
router.delete("/delete/:id", deleteUser);
router.put("/update/:id", updateUser);
router.get("/get", getUser);
router.get("/user", userRegister);
router.post("/register", createRegister);
router.post("/login", loginRegister);
router.post("/slider", upload.fields([
    { name: "video", maxCount: 1 },
    { name: "image", maxCount: 1 },
]), createSlider);
router.get("/getSlider", getSlider);

router.post("/post", upload.fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
]), createUser);

router.post("/progress", auth, progress);
router.get("/progress/:courseId", auth, getProgress);
router.get("/certificate/:courseId", auth, generateCertificate);
router.put("/updateCourse/:id", upload.single("image"), updateCourse);

router.get("/getPopulate", getUserAdress)
router.post("/createAdress", createAddress)
router.post("/createUserDetails", createUserDetails)



export default router