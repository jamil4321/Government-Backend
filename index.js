const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer"); // Add this line
app.use(express.json({ limit: '50mb' })); // Increase the limit for express.json()
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
app.use(express.urlencoded({ extended: false }));

const mongoUrl = "mongodb+srv://newtest:newtest@cluster0.verwgdi.mongodb.net/"

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

require("./userDetails");
require("./imageDetails");

const User = mongoose.model("UserInfo");
const Images = mongoose.model("ImageDetails");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Set the limit to 50MB (adjust as needed)
});

app.post("/register", async (req, res) => {
  const { email, password, location, type } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.json({ error: "User Exists" });
    }
    await User.create({
      email,
      password: encryptedPassword,
      location,
      type
    });
    return res.json({ error: "User created  " });
  } catch (error) {
    res.send({ status: "error" });
  }
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    console.log("email Found");

    // Check if user.password exists before comparing
    if (user.password) {
      const passCompare = await bcrypt.compare(password, user.password);

      if (passCompare) {
        return res.json({ password: "User Logined Successfully", user });
        // console.log("password Found");node index.js
      } else {
        console.log("password not found");
        return res.status(400).json({ error: "User or Password not Matched" })
      }
    } else {
      console.log("User has no password");
      return res.status(400).json({ error: "User or Password not Matched" })
    }
  } else {
    console.log("email not found");
    return res.status(400).json({ error: "User or Password not Matched" })
  }
});

app.post("/upload-image", async (req, res) => {
  const { base64 } = req.body;
  try {
    await Images.create({ image: base64, name: req.body.name, select: req.body.select, password: req.body.password, fileid: req.body.fileid, date: req.body.date, code: req.body.qrCodeImage, location: req.body.location, QrGet: req.body.QrGet, Qrcode: req.body.uniqueId });
    res.send({ Status: "ok" })

  } catch (error) {
    res.send({ Status: "error", data: error });

  }
})

app.get("/get-image", async (req, res) => {
  try {
    await Images.find({}).then(data => {
      res.send({ status: "ok", data: data })
    })

  } catch (error) {
    return res.status(400)
  }
})

app.get("/get-image/:id", async (req, res) => {
  console.log(req.params,"params")
  try {
    await Images.find({fileid:req.params.id}).then(data => {
      res.send({ status: "ok", data: data })
    })

  } catch (error) {
    return res.status(400)
  }
})

app.get("/get-image/find_by_qr/:id", async (req, res) => {
  console.log(req.params,"params")
  try {
    await Images.find({Qrcode:req.params.id}).then(data => {
      console.log(data)
      res.send({ status: "ok", data: data })
      
    })

  } catch (error) {
    return res.status(400)
  }
})

app.get("/get-image-count", async (req, res) => {
  console.log(req.params,"params")
  try {
   let count =  await Images.find().countDocuments()
    console.log(count)
    return res.send({data:count})
  } catch (error) {
    return res.status(400)
  }
})


app.get("/", async (req, res) => {
  res.send("Hello Wolrd")
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server Started");
});

