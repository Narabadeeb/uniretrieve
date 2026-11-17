import { House, Search, CirclePlus, Bell } from "lucide-react";

export default function BottomNav({ page, onGo, onSearch, unread }) {
  return (
    <nav className="bottom-nav">
      <button className={page === "home" ? "active" : ""} onClick={() => onGo("home")}>
        <House size={22} />
        <span>หน้าหลัก</span>
      </button>
      <button onClick={onSearch}>
        <Search size={22} />
        <span>ค้นหา</span>
      </button>
      <button className="plus" onClick={() => onGo("report", "lost")}>
        <CirclePlus size={30} />
        <span>แจ้งของ</span>
      </button>
      <button className={page === "notifications" ? "active" : ""} onClick={() => onGo("notifications")}>
        <Bell size={22} />
        {unread > 0 && <em className="count">{unread}</em>}
        <span>แจ้งเตือน</span>
      </button>
    </nav>
  );
}