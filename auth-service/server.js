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

const allowedDomains = (process.env.ALLOWED_EMAIL_DOMAINS || "")
  .split(",")
  .map((d) => d.trim().toLowerCase())
  .filter(Boolean);

function isUniversityEmail(email) {
  if (typeof email !== "string") return false;
  const match = email
    .trim()
    .toLowerCase()
    .match(/^[a-z0-9._%+-]+@([a-z0-9-]+(\.[a-z0-9-]+)+)$/);
  return !!match && allowedDomains.includes(match[1]);
}

mongoose
  .connect(process.env.MONGO_URL || "mongodb://localhost:27017/uniretrieve")
  .then(() => console.log("auth-service: เชื่อมต่อ MongoDB สำเร็จ!"))
  .catch((error) => console.log("เชื่อมต่อ MongoDB ไม่สำเร็จ:", error.message));

// สมัครสมาชิก
app.post("/register", async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = (req.body.email || "").trim().toLowerCase();

    if (!name || !email || !password)
      return res.status(400).json({ message: "กรอกข้อมูลให้ครบ" });
    if (!isUniversityEmail(email))
      return res.status(400).json({
        message: "กรุณาใช้อีเมลมหาวิทยาลัยศรีปทุมเท่านั้น (@spu.ac.th หรือ @spumail.net)",
      });
    if (password.length < 8)
      return res.status(400).json({ message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "อีเมลนี้สมัครแล้ว" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      message: "สมัครสมาชิกสำเร็จ",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    res.status(400).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
});

// เข้าสู่ระบบ
app.post("/login", async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const user = await User.findOne({ email });
    const ok = user && (await bcrypt.compare(req.body.password || "", user.password));
    if (!ok)
      return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });

    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(400).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
});

// ตรวจ token
app.get("/me", (req, res) => {
  try {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: payload });
  } catch {
    res.status(401).json({ message: "token ไม่ถูกต้องหรือหมดอายุ" });
  }
});

app.listen(3001, () => {
  console.log("auth-service กำลังทำงานที่ http://localhost:3001");
});