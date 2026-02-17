import progressModel from "../model/progressModel.js";
import registerModel from "../model/registerModel.js"
import { sliderModel } from "../model/sliderModel.js";
import { userModel } from "../model/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import PDFDocument from "pdfkit";
import { User } from "../model/userModel1.js";
import { Address } from "../model/addressModel.js";




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

// slderdetails
const createSlider = async (req, res) => {
    try {
        const data = {
            name: req.body.name,
            image: `http://localhost:3000/uploads/${req.files.image[0].filename}`,
            // video: `http://localhost:3000/uploads/${req.files.video[0].filename}`,
            video: req.body.video
        }


        const user = await sliderModel.create(data)

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


const createVideo = async (req, res) => {
    try {
        const data = {
            name: req.body.name,
            image: `http://localhost:3000/uploads/${req.files.image[0].filename}`,
            // video: `http://localhost:3000/uploads/${req.files.video[0].filename}`,
            video: req.body.video
        }


        const user = await sliderModel.create(data)

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



const getSlider = async (req, res) => {
    try {
        const user = await sliderModel.find()

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


const getUserAdress = async (req, res) => {
    try {
        const users = await User.find().populate("address");

        console.log(users);


        res.status(201).json({
            success: true,
            message: "user fetched successfully",
            data: users  

        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const createAddress = async (req, res) => {
    try {



        const registerData = {
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode

        }

        const register = await Address.create(registerData)


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
const createUserDetails = async (req, res) => {
    try {



        const registerData = {
            name: req.body.name,
            email: req.body.email,
            address: req.body.addressId


        }

        const register = await User.create(registerData)


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

// update course
const updateCourse = async (req, res) => {
    const updateData = {
        name: req.body.name,
        description: req.body.description
    };

    if (req.file) {
        updateData.image = `http://localhost:3000/uploads/${req.file.filename}`;
    }

    const course = await userModel.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        // { new: true }
    );

    res.json({ success: true, data: course });
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
        <form action="/api/slider" method="post" enctype="multipart/form-data">
        <input type='file' name="image"/>
        <br/>
         <br/>
          <label>Link</label>
          <input type='text' name="video"/>
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
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            "secretkey",
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



// progress

const progress = async (req, res) => {
    const { courseId, progress } = req.body;

    let data = await progressModel.findOne({
        userId: req.user.id,
        courseId
    });

    if (data) {
        data.progress = progress;
        if (progress === 100) data.completed = true;
        await data.save();
    } else {
        data = await progressModel.create({
            userId: req.user.id,
            courseId,
            progress,
            completed: progress === 100
        });
    }

    res.json({ success: true, data });
};

const getProgress = async (req, res) => {
    const data = await progressModel.findOne({
        userId: req.user.id,
        courseId: req.params.courseId
    });

    res.json(data || { progress: 0 });
};

// certificate

const generateCertificate = async (req, res) => {
    try {
        const userId = req.user.id;
        const courseId = req.params.courseId;

        const progress = await progressModel.findOne({ userId, courseId });

        if (!progress || progress.progress !== 100) {
            return res.status(403).json({ message: "Course not completed" });
        }

        const user = await registerModel.findById(userId);
        const course = await userModel.findById(courseId);

        const doc = new PDFDocument({ size: "A4" });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline; filename=certificate.pdf");

        doc.pipe(res);


        doc.rect(0, 0, 600, 850).fill("#f5f5f5");

        doc.fillColor("#000");
        doc.fontSize(30).text("Certificate of Completion", { align: "center" });
        doc.moveDown(2);

        doc.fontSize(18).text(`This certifies that`, { align: "center" });
        doc.moveDown();

        doc.fontSize(26).fillColor("#2b547e").text(user.name, { align: "center" });
        doc.moveDown();

        doc.fontSize(18).fillColor("#000").text(`has successfully completed`, { align: "center" });
        doc.moveDown();

        doc.fontSize(22).text(course.name, { align: "center" });
        doc.moveDown(2);

        doc.fontSize(14).text(`Date: ${new Date().toDateString()}`, { align: "center" });

        doc.end();

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export {
    createUser, form, getUser, createRegister, loginRegister,
    userRegister, deleteUser, updateUser, progress, getProgress, generateCertificate,
    createSlider, getSlider, updateCourse, createVideo, getUserAdress, createAddress,
    createUserDetails
}