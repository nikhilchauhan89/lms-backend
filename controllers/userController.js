import registerModel from "../model/registerModel.js"
import { userModel } from "../model/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";



const createUser = async (req, res) => {
    try {
        const data = {
            name: req.body.name,
            file: `http://localhost:3000/uploads/${req.files.file[0].filename}`,
            description: req.body.description,
            image: `http://localhost:3000/uploads/${req.files.image[0].filename}`,
        }


        const user = await userModel.create(data)

        res.status(201).json({
            success: true,
            message: "user created successfully",
            data: user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

// const createCourse = async (req, res) => {
//     try {
//         const data = {
//             name: req.body.name,
//             file: `http://localhost:3000/uploads/${req.file.filename}`
//         }


//         const user = await userModel.create(data)

//         res.status(201).json({
//             success: true,
//             message: "user created successfully",
//             data: user
//         })
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     }

// }

const getUser = async (req, res) => {
    try {
        const user = await userModel.find()

        res.status(201).json({
            success: true,
            message: "user fetched successfully",
            data: user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel.findByIdAndDelete(id);

        res.status(201).json({
            success: true,
            message: "user delete successfully",
            data: user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel.findByIdAndUpdate(id, { $set: req.body });

        res.status(201).json({
            success: true,
            message: "user delete successfully",
            data: user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



const form = (req, res) => {
    res.send(`
        <form action="/api/post" method="post" enctype="multipart/form-data">
        <input type='file' name="file"/>
        <br/>
         <br/>
        <label>Name</label>
        <input type='text' name="name"/>
         <br/>
          <br/>
      <button type="submit">Upload file</button>

        </form>
        `)
}

const createRegister = async (req, res) => {
    try {

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const registerData = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        }

        const register = await registerModel.create(registerData)
        // const token =
        //     jwt.sign({
        //         id: register._id, email: register.email
        //     }, "secretkey", { expiresIn: "1d" }
        //     );


        res.status(201).json({
            success: true,
            messsage: "save successfully",
            data: register,
            // token: token
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message

        })


    }
}

const userRegister = async (req, res) => {
    try {
        const user = await registerModel.find()

        res.status(201).json({
            success: true,
            message: "user fetched successfully",
            data: user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


const loginRegister = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await registerModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            "secretkey",
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token: token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

}

export { createUser, form, getUser, createRegister, loginRegister, userRegister, deleteUser, updateUser }