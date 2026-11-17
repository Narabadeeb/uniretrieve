require("dotenv").config();

if (!process.env.JWT_SECRET) {
  console.error("ไม่พบ JWT_SECRET ใน .env");
  process.exit(1);
}
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/uniretrieve")
  .then(() => {
    console.log("auth-service: เชื่อมต่อ MongoDB สำเร็จ!");
  })
  .catch((error) => {
    console.log("เชื่อมต่อ MongoDB ไม่สำเร็จ:", error.message);
  });

app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });
    await newUser.save();
    res.status(201).json({ message: "สมัครสมาชิกสำเร็จ", user: { id: newUser._id, name: newUser.name, email: newUser.email } });
  } catch (error) {
    res.status(400).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "ไม่พบอีเมลนี้ในระบบ" });
    }
    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(200).json({ message: "เข้าสู่ระบบสำเร็จ", token: token });
  } catch (error) {
    res.status(400).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
});

app.listen(3001, () => {
  console.log("auth-service กำลังทำงานที่ http://localhost:3001");
});