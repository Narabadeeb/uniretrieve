import { useCallback, useEffect, useRef, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Backpack, Bell, Search, User, ArrowUpDown, CircleCheck } from "lucide-react";
import { getItems } from "./api";
import { socket } from "./socket";
import { CATEGORIES, normalizeCategory } from "./categories";
import { useAuth } from "./AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ItemCard from "./components/ItemCard";
import ReportForm from "./components/ReportForm";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";

const TOAST_MS = 10000;

function Home() {
  const [page, setPage] = useState("home");
  const [reportType, setReportType] = useState("lost");
  const [items, setItems] = useState([]);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState("ทั้งหมด");
  const [keyword, setKeyword] = useState("");
  const [toasts, setToasts] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [seenCount, setSeenCount] = useState(0);
  const [connected, setConnected] = useState(null);
  const searchRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const loadItems = useCallback(async () => {
    try {
      setItems(await getItems());
      setError(false);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onMatch = (data) => {
      const name = data.newItem ? data.newItem.name : "รายการใหม่";
      const count = data.matches ? data.matches.length : 0;
      const id = Date.now();
      const text = `"${name}" ตรงกับ ${count} รายการ`;
      const time = new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
      setToasts((t) => [...t, { id, msg: `จับคู่สำเร็จ! ${text}` }]);
      setNotifs((n) => [{ id, title: "จับคู่สำเร็จ!", text, time }, ...n]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), TOAST_MS);
      loadItems();
    };

    if (socket.connected) setConnected(true);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("match-notification", onMatch);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("match-notification", onMatch);
    };
  }, [loadItems]);
  function goTo(p, type) {
    if (p === "report" && !user) {
      navigate("/login");
      return;
    }
    if (page === "notifications") setSeenCount(notifs.length);
    setPage(p);
    if (type) setReportType(type);
    if (p === "home") loadItems();
  }

  function focusSearch() {
    goTo("home");
    setTimeout(() => searchRef.current?.focus(), 0);
  }

  const unread = page === "notifications" ? 0 : notifs.length - seenCount;

  const kw = keyword.trim().toLowerCase();
  const shown = items
    .filter((i) => category === "ทั้งหมด" || normalizeCategory(i.category) === category)
    .filter((i) => !kw || `${i.name || ""} ${i.location || ""}`.toLowerCase().includes(kw))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const connText =
    connected === null ? "กำลังเชื่อมต่อแจ้งเตือน..." :
      connected ? "เชื่อมต่อแจ้งเตือนแล้ว" : "หลุดการเชื่อมต่อ";
  const dotCls = connected === null ? "" : connected ? "on" : "off";

  return (
    <>
      <div className="toast-box">
        {toasts.map((t) => (
          <div className="toast" key={t.id}>
            <CircleCheck size={20} /> {t.msg}
          </div>
        ))}
      </div>

      <header className="topbar">
        <div className="brand">
          <div className="logo">
            <Backpack size={24} />
          </div>
          <div>
            <h1>UniRetrieve</h1>
            <p>ระบบแจ้งของหาย/ของเจอในมหาวิทยาลัย</p>
          </div>
        </div>

        <div className="search-box">
          <Search size={18} />
          <input
            ref={searchRef}
            type="search"
            placeholder="ค้นหาชื่อสิ่งของ, สถานที่..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => page !== "home" && goTo("home")}
          />
        </div>

        <button className="icon-btn" aria-label="การแจ้งเตือน" onClick={() => goTo("notifications")}>
          <Bell size={22} />
          {unread > 0 && <em className="count">{unread}</em>}
        </button>

        {user ? (
          <>
            <span style={{ fontSize: 14, whiteSpace: "nowrap" }}>{user.name}</span>
            <button className="icon-btn" onClick={logout} style={{ width: "auto", padding: "0 14px" }}>
              ออกจากระบบ
            </button>
          </>
        ) : (
          <Link to="/login" className="avatar" aria-label="เข้าสู่ระบบ">
            <User size={20} />
          </Link>
        )}
      </header>

      <div className="layout">
        <Sidebar page={page} reportType={reportType} onGo={goTo} unread={unread} />

        <main className="main">
          {page === "home" && (
            <>
              <section className="panel chips-panel">
                <span className="chips-title">หมวดหมู่</span>
                <div className="chips">
                  {CATEGORIES.map(({ name, icon: Icon }) => (
                    <button
                      key={name}
                      className={`chip ${category === name ? "active" : ""}`}
                      onClick={() => setCategory(name)}
                    >
                      <Icon size={16} /> {name}
                    </button>
                  ))}
                </div>
              </section>

              <p className="conn">
                <span className={`dot ${dotCls}`} /> {connText}
              </p>

              <div className="list-head">
                <h2>
                  รายการล่าสุด
                  <span className="sort">
                    <ArrowUpDown size={14} /> เรียงจากใหม่ไปเก่า
                  </span>
                </h2>
                <span className="total">พบทั้งหมด {shown.length} รายการ</span>
              </div>

              <div className="list">
                {error ? (
                  <div className="empty">เชื่อมต่อ item-service ไม่ได้ (เช็คว่ารันที่ port 3002)</div>
                ) : shown.length ? (
                  shown.map((i) => <ItemCard key={i.id} item={i} />)
                ) : (
                  <div className="empty">ไม่พบรายการ</div>
                )}
              </div>
            </>
          )}

          {page === "report" && (
            <ReportForm type={reportType} onTypeChange={setReportType} onDone={() => goTo("home")} />
          )}
          {page === "notifications" && (
            <section>
              <h2 className="page-title">การแจ้งเตือน</h2>
              {notifs.length ? (
                <div className="notif-list">
                  {notifs.map((n) => (
                    <div className="notif" key={n.id}>
                      <div className="notif-ico">
                        <Bell size={20} />
                      </div>
                      <div>
                        <strong>{n.title}</strong>
                        <p>{n.text}</p>
                      </div>
                      <time>{n.time}</time>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty">ยังไม่มีการแจ้งเตือน (จะแสดงเมื่อระบบจับคู่ของหาย/ของเจอได้)</div>
              )}
            </section>
          )}
        </main>
      </div>

      <BottomNav page={page} onGo={goTo} onSearch={focusSearch} unread={unread} />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/*" element={<Home />} />
    </Routes>
  );
}