import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import mongoose from 'mongoose';
import { imageModel } from './model/model.js';
import { cardModel } from './model/cardModel.js';
import bcrypt from 'bcrypt'
import AdminRoutes from './model/Admin.js';
import { cardModel1 } from './model/card1Model.js';


const app = express();

mongoose.connect("mongodb://localhost:27017/node-project")
  .then(() => console.log(" MongoDB connected via Mongoose"))

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})
const upload = multer({ storage })

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  // methods: ["GET", "POST", "PUT", "DELETE"],
  // allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(cookieParser());


app.post('/signup', async (req, res) => {
  const values = req.body;
  const { name, email, password, number, city } = values;
  if (!name || !email || !password || !number || !city) {
    res.send({ success: false, msg: 'signup not done try again' });
  }


  const hashedPassword = await bcrypt.hash(password, 10);
  values.password = hashedPassword;


  const user = await imageModel.create(values);

  if (user) {
    jwt.sign({ id: user._id, email: user.email }, 'Google', { expiresIn: '5d' }, (error, token) => {
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 259200000
      })
      res.send({ success: true, msg: 'signup done', token });
      console.log(token)
    });
  } else {
    res.send({ success: false, msg: 'signup not done try again' });
  }

});


app.post('/login', async (req, res) => {
  const userData = req.body;
  const { email, password } = userData;

  if (!email || !password) {
    res.send({ success: false, msg: 'login not done try again' });
  }
  // const db = await connection();
  // const collection = db.collection('users');
  // const result = await collection.
  const user = await imageModel.findOne({
    email: email,

  });
  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, msg: "Invalid password" });
  }

  if (user) {
    jwt.sign({ id: user._id, email: user.email }, 'Google',
      { expiresIn: '5d' }, (error, token) => {
        res.send({ success: true, msg: 'login done', token });
      });
  } else {
    res.send({ success: false, msg: 'login not done try again' });
  }

});

app.get("/", (req, res) => {
  res.send(`
        <form action="/upload" method="post" enctype="multipart/form-data">
        <input type='file' name="myFile"/>
        <br/>
         <br/>
        <label>title</label>
        <input type='text' name="title"/>
         <br/>
          <br/>
        <label>price</label>
      <input type='number' name="price"/>
       <br/>
        <br/>
        <label>size</label>
      <input type='size' name="size"/>
       <br/>
        <br/> 
        <label>status</label>
      <input type='text' name="status"/>
       <br/>
        <br/>
        <label>type</label>
      <input type='text' name="type"/>
       <br/>
        <br/>
          <label>location</label>
        <input type='location' name="location"/>
          <label>link</label>
        <input type='link' name="link"/>
      <button type="submit">Upload file</button>

        </form>
        `)
})
app.use('/upload', express.static('upload'));


app.post('/upload', upload.single('myFile'), async (req, res) => {
  try {
    const data = {
      ...req.body,
      // fileName: req.file ? req.file.filename : null,
      filePath: req.file ? `http://localhost:3200/upload/${req.file.filename}` : null,
    };


    const card = await cardModel.create(data);


    res.send({
      success: true,
      message: 'File uploaded and data inserted',
      card,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({
      success: false,
      message: 'Upload failed',
      error: error.message,
    });
  }
});


app.use('/uploads', upload.single('myFile'), express.static('upload'));

app.post('/uploads', async (req, res) => {
  try {
    const data = {
      ...req.body,
      fileName: req.file ? req.file.filename : null,
      filePath: req.file ? `http://localhost:3200/upload/${req.file.filename}` : null,
    };


    const card = await cardModel1.create(data);



    res.send({
      success: true,
      message: 'File uploaded and data inserted',
      card,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({
      success: false,
      message: 'Upload failed',
      error: error.message,
    });
  }
});
app.get("/datas", async (req, res) => {
  // const db = await connection();
  //   const collection = await db.collection("users1")
  // const result = await collection.find().toArray()
  const user = await cardModel1.find()
  if (user) {
    res.send({
      message: "task  fetched",
      success: true,
      user
    })
  } else {
    res.send({
      message: "task list not fetched !try again",
      success: false
    })

  }

})

// app.put("/update/:id",async(req,res)=>{

//   res.send("update")
// }) 
app.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const result = await cardModel.findByIdAndUpdate(id, { $set: req.body });

  if (result) {
    res.send({
      message: "succesfully updated",
      success: true,
      result: result
    });
  } else {
    res.send({
      message: "not updated",
      success: false,
      result: result
    });
  }
})

app.delete("/delete/:id", async (req, res) => {

  const id = req.params.id;
  const result = await cardModel.findByIdAndDelete(id);
  if (result) {
    res.send({
      message: "succesfully deleted",
      success: true,
      result: result
    });
  } else {
    res.send({
      message: "not deleted",
      success: false,
      result: result
    });
  }
})


app.get("/data", async (req, res) => {
  const user = await cardModel.find()
  if (user) {
    res.send({
      message: "task  fetched",
      success: true,
      user
    })
  } else {
    res.send({
      message: "task list not fetched !try again",
      success: false
    })

  }

})
app.get("/data1", async (req, res) => {
  const user = await cardModel.find()
  if (user) {
    res.send({
      message: "task  fetched",
      success: true,
      user
    })
  } else {
    res.send({
      message: "task list not fetched !try again",
      success: false
    })

  }

})

app.use("/admin", AdminRoutes)
app.listen(3200,()=>{
  console.log("server is running on  port 3200")
})








































// import express from 'express';
// import cors from 'cors';
// import { collectionName, connection } from './dbConfig.js';
// import jwt from 'jsonwebtoken';
// import cookieParser from 'cookie-parser';
// import multer from 'multer';
// import fs from 'fs';

// const app = express();

// // ✅ Create uploads folder if it doesn't exist
// if (!fs.existsSync('uploads')) {
//   fs.mkdirSync('uploads');
// }

// // ✅ Multer setup for profile image storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + '-' + file.originalname;
//     cb(null, uniqueName);
//   },
// });
// const upload = multer({ storage });

// // ✅ Middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true,
// }));

// // ✅ Serve uploads folder as static
// app.use('/uploads', express.static('uploads'));

// // =============================================
// // ✅ SIGNUP (with profile image)
// app.post('/signup', upload.single('file'), async (req, res) => {
//   try {
//     const values = req.body;
//     const file = req.file;

//     if (!values.email || !values.password) {
//       return res.send({ success: false, msg: 'Email and password are required' });
//     }

//     const db = await connection();
//     const collection = db.collection('users');

//     // Normalize file path for frontend URL
//     const userData = {
//       ...values,
//       filePath: file ? file.path.replace(/\\/g, '/') : null,
//     };

//     const result = await collection.insertOne(userData);

//     if (result.insertedId) {
//       jwt.sign(userData, 'Google', { expiresIn: '5d' }, (err, token) => {
//         res.send({
//           success: true,
//           msg: 'Signup successful',
//           token,
//           user: userData, // send back user info including filePath
//         });
//       });
//     } else {
//       res.send({ success: false, msg: 'Signup failed' });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ success: false, msg: 'Server error' });
//   }
// });

// // =============================================
// // ✅ LOGIN
// app.post('/login', async (req, res) => {
//   const userData = req.body;

//   if (!userData.email || !userData.password) {
//     return res.send({ success: false, msg: 'Email and password are required' });
//   }

//   const db = await connection();
//   const collection = db.collection('users');
//   const result = await collection.findOne({
//     email: userData.email,
//     password: userData.password,
//   });

//   if (result) {
//     jwt.sign(userData, 'Google', { expiresIn: '5d' }, (err, token) => {
//       res.send({
//         success: true,
//         msg: 'Login successful',
//         token,
//         user: {
//           email: result.email,
//           name: result.name,
//           filePath: result.filePath,
//         },
//       });
//     });
//   } else {
//     res.send({ success: false, msg: 'Invalid credentials' });
//   }
// });

// // =============================================
// // ✅ GET USER BY EMAIL
// app.get('/getUser', async (req, res) => {
//   try {
//     const { email } = req.query;
//     if (!email) return res.send({ success: false, msg: 'Email required' });

//     const db = await connection();
//     const collection = db.collection('users');
//     const user = await collection.findOne({ email });

//     if (user) {
//       res.send({ success: true, user });
//     } else {
//       res.send({ success: false, msg: 'User not found' });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ success: false, msg: 'Server error' });
//   }
// });

// // =============================================
// // ✅ FILE TEST ROUTE (optional)
// app.post('/', upload.single('file'), (req, res) => {
//   res.send({
//     message: 'File uploaded successfully',
//     file: req.file,
//   });
// });

// // =============================================
// // ✅ SERVER START
// app.listen(3200, () => {
//   console.log('Server running on http://localhost:3200');
// });







// app.post("/insert",upload, async (req, res) => {
//     const db = await connection();
//     const collection = db.collection("users1");
//       const result = await collection.insertOne(req.body)
//         if (result) {

//         res.send({
//             message: "new task added",
//             success: true,
//             result
//         })
//     } else {
//         res.send({
//             message: "task not added",
//             success: false
//         })
//     }
// })
// app.post("/add-task",verifyJwtToken, async (req, res) => {
//     const db = await connection()
//     const collection = await db.collection(collectionName)
//     const result = await collection.insertOne(req.body);
//     if (result) {

//         res.send({
//             message: "new task added",
//             success: true,
//             result
//         })
//     } else {
//         res.send({
//             message: "task not added",
//             success: false
//         })
//     }

// })

// app.get("/tasks", verifyJwtToken, async (req, res) => {
//     const db = await connection();
//     // console.log("cookies test",req.cookies)
//     const collection = await db.collection(collectionName)
//     const result = await collection.find().toArray()
//     if (result) {
//         res.send({
//             message: "task list fetched",
//             success: true,
//             result
//         })
//     } else {
//         res.send({
//             message: "task list not fetched !try again",
//             success: false
//         })

//     }

// })

// app.get("/task/:id",verifyJwtToken, async (req, res) => {
//     const db = await connection();
//     const id = req.params.id;
//     const collection = await db.collection(collectionName)
//     const result = await collection.findOne({ _id: new ObjectId(id) })
//     if (result) {
//         res.send({
//             message: "task  fetched",
//             success: true,
//             result
//         })
//     } else {
//         res.send({
//             message: "task list not fetched !try again",
//             success: false
//         })

//     }

// })
// app.delete("/delete/:id",verifyJwtToken, async (req, res) => {
//     const db = await connection();
//     const id = req.params.id;
//     const collection = await db.collection(collectionName)
//     const result = await collection.deleteOne({ _id: new ObjectId(id) })
//     if (result) {
//         res.send({
//             message: "task list deleted",
//             success: true,
//             result
//         })
//     } else {
//         res.send({
//             message: "task list not delelted !try again",
//             success: false
//         })

//     }

// })
// app.delete("/delete-multiple",verifyJwtToken, async (req, res) => {
//     const db = await connection();
//     const Ids = req.body;
//     const deleteTaskIds = Ids.map((item) => new ObjectId(item))
//     const collection = await db.collection(collectionName)
//     const result = await collection.deleteMany({ _id: { $in: deleteTaskIds } })
//     if (result) {
//         res.send({
//             message: "task list deleted",
//             success: true,
//             result
//         })
//     } else {
//         res.send({
//             message: "task list not delelted !try again",
//             success: false
//         })

//     }

// })

// app.put("/update-task",verifyJwtToken, async (req, res) => {
//     const db = await connection()
//     const collection = await db.collection(collectionName)
//     const { _id, ...fields } = req.body
//     const update = { $set: fields }
//     const result = await collection.updateOne({ _id: new ObjectId(_id) }, update)
//     if (result) {
//         res.send({
//             message: "task list deleted",
//             success: true,
//             result
//         })
//     } else {
//         res.send({
//             message: "task list not delelted !try again",
//             success: false
//         })

//     }

// })



// app.get("/", (req, res) => {
//     res.send({
//         message: "Basic API done",
//         success: true
//     })
// })
// function verifyJwtToken(req, res, next) {
//     const token = req.cookies['token'];
//     jwt.verify(token, "Google", (error, decoded) => {
//         if(error){
//             return res.send({
//                 message:"invalid token",
//                 success:false
//             })
//         }
//         console.log(decoded)
//         next()
//     })

// }

