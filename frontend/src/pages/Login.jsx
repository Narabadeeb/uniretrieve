import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { useAuth } from "../AuthContext";
import AuthLayout, { Field } from "../components/AuthLayout";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(0);
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
      setShake((k) => k + 1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout badgeIcon={LogIn} badge="เข้าสู่ระบบ">
      <form onSubmit={handleSubmit}>
        <Field icon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="อีเมลมหาวิทยาลัย (@spumail.net)" autoComplete="username" />
        <Field icon={Lock} type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="รหัสผ่าน" autoComplete="current-password" />
        {error && <p key={shake} className="auth-msg error" role="alert">{error}</p>}
        <button className="auth-submit" type="submit" disabled={loading}>
          <LogIn /> {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>
      <div className="auth-or">หรือ</div>
      <div className="auth-switch">ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิก</Link></div>
      <div className="auth-back"><Link to="/">กลับหน้าหลัก</Link></div>
    </AuthLayout>
  );
}
