import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, UserPlus } from "lucide-react";
import { useAuth } from "../AuthContext";
import AuthLayout, { Field, celebrate } from "../components/AuthLayout";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(0);
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setOk("");
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      setDone(true);
      setOk("สมัครสมาชิกสำเร็จ กำลังพาไปหน้าเข้าสู่ระบบ...");
      celebrate();
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.message);
      setShake((k) => k + 1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout badgeIcon={UserPlus} badge="สมัครสมาชิก">
      <form onSubmit={handleSubmit}>
        <Field icon={User} value={name} onChange={(e) => setName(e.target.value)}
          placeholder="พิมพ์ ชื่อ-นามสกุล" autoComplete="name" />
        <Field icon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="อีเมลมหาวิทยาลัย (@spumail.net)" autoComplete="username" />
        <Field icon={Lock} type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="รหัสผ่าน (8 ตัวขึ้นไป)" autoComplete="new-password" minLength={8} />
        {error && <p key={shake} className="auth-msg error" role="alert">{error}</p>}
        {ok && <p className="auth-msg ok">{ok}</p>}
        <button className="auth-submit" type="submit" disabled={loading || done}>
          <UserPlus /> {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
        </button>
      </form>
      <div className="auth-or">หรือ</div>
      <div className="auth-switch">มีบัญชีแล้ว? <Link to="/login">เข้าสู่ระบบ</Link></div>
      <div className="auth-back"><Link to="/">กลับหน้าหลัก</Link></div>
    </AuthLayout>
  );
}
