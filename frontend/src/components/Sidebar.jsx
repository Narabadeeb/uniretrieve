import { House, CirclePlus, Gift, Bell } from "lucide-react";

const MENU = [
  { label: "หน้าหลัก", Icon: House, page: "home" },
  { label: "แจ้งของหาย", Icon: CirclePlus, page: "report", type: "lost" },
  { label: "แจ้งของเจอ", Icon: Gift, page: "report", type: "found" },
  { label: "การแจ้งเตือน", Icon: Bell, page: "notifications" },
];

export default function Sidebar({ page, reportType, onGo, unread }) {
  return (
    <aside className="sidebar">
      <nav className="side-nav">
        {MENU.map(({ label, Icon, page: p, type }) => {
          const active = page === p && (!type || reportType === type);
          return (
            <button
              key={label}
              className={`side-item ${active ? "active" : ""}`}
              onClick={() => onGo(p, type)}
            >
              <Icon size={22} />
              <span>{label}</span>
              {p === "notifications" && unread > 0 && <em className="count">{unread}</em>}
            </button>
          );
        })}
      </nav>
      <p className="slogan">
        ของหาย...
        <br />
        ไม่ใช่เรื่องเล็ก
        <br />
        เราช่วยกันได้
      </p>
    </aside>
  );
}