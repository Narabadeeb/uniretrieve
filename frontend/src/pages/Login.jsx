import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

const box = { maxWidth: 380, margin: "80px auto", padding: 28, background: "#fff",
  borderRadius: 20, boxShadow: "0 8px 30px rgba(99,102,241,.15)", display: "grid", gap: 12 };
const input = { padding: "12px 14px", borderRadius: 12, border: "1px solid #d9d9f3", fontSize: 15 };
const btn = { padding: 12, borderRadius: 12, border: "none", color: "#fff", fontSize: 16,
  background: "linear-gradient(90deg,#6366f1,#7c6cf8)", cursor: "pointer" };

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={box}>
      <h2 style={{ margin: 0 }}>เข้าสู่ระบบ UniRetrieve</h2>
      <input style={input} type="email" autoComplete="username"
        placeholder="อีเมลมหาวิทยาลัย (@spumail.net)"
        value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input style={input} type="password" autoComplete="current-password"
        placeholder="รหัสผ่าน"
        value={password} onChange={(e) => setPassword(e.target.value)} required />
      {error && <p style={{ color: "#e11d48", margin: 0 }}>{error}</p>}
      <button style={btn} type="submit" disabled={loading}>
        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>
      <p style={{ margin: 0, textAlign: "center" }}>
        ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิก</Link> · <Link to="/">กลับหน้าหลัก</Link>
      </p>
    </form>
  );
}
