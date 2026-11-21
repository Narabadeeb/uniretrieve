import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

const ALLOWED = ["spu.ac.th", "spumail.net"];

const box = { maxWidth: 380, margin: "80px auto", padding: 28, background: "#fff",
  borderRadius: 20, boxShadow: "0 8px 30px rgba(99,102,241,.15)", display: "grid", gap: 12 };
const input = { padding: "12px 14px", borderRadius: 12, border: "1px solid #d9d9f3", fontSize: 15 };
const btn = { padding: 12, borderRadius: 12, border: "none", color: "#fff", fontSize: 16,
  background: "linear-gradient(90deg,#6366f1,#7c6cf8)", cursor: "pointer" };

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const domain = email.trim().toLowerCase().split("@")[1];
    if (!ALLOWED.includes(domain)) {
      setError("กรุณาใช้อีเมลมหาวิทยาลัยศรีปทุมเท่านั้น (@spu.ac.th หรือ @spumail.net)");
      return;
    }
    try {
      await register(name, email, password);
      alert("สมัครสำเร็จ! กรุณาเข้าสู่ระบบ");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={box}>
      <h2 style={{ margin: 0 }}>สมัครสมาชิก</h2>
      <input style={input} placeholder="ชื่อ-นามสกุล" value={name}
        onChange={(e) => setName(e.target.value)} required />
      <input style={input} type="email" placeholder="รหัสนักศึกษา@spumail.net"
        value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input style={input} type="password" placeholder="รหัสผ่าน (อย่างน้อย 8 ตัว)"
        value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
      {error && <p style={{ color: "#e11d48", margin: 0 }}>{error}</p>}
      <button style={btn} type="submit">สมัครสมาชิก</button>
      <p style={{ margin: 0, textAlign: "center" }}>
        มีบัญชีแล้ว? <Link to="/login">เข้าสู่ระบบ</Link> · <Link to="/">กลับหน้าหลัก</Link>
      </p>
    </form>
  );
}
