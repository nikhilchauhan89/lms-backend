import express from "express"
import multer from "multer";
import { createRegister, createUser, deleteUser, form, getUser, loginRegister, updateUser, userRegister } from "../controllers/userController.js";

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
router.post("/post", upload.fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
]), createUser);
router.post("/dummy", loginRegister);

export default router