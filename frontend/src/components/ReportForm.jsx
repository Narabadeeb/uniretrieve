import { useState } from "react";
import { Frown, Smile, Send } from "lucide-react";
import { createItem } from "../api";
import { CATEGORIES } from "../categories";

const FORM_CATEGORIES = CATEGORIES.filter((c) => c.name !== "ทั้งหมด");

export default function ReportForm({ type, onTypeChange, onDone }) {
  const [form, setForm] = useState({ name: "", category: FORM_CATEGORIES[0].name, location: "" });
  const [sending, setSending] = useState(false);

  const isLost = type === "lost";
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.location.trim()) {
      return alert("กรอกชื่อสิ่งของและสถานที่ก่อนนะ");
    }
    setSending(true);
    try {
      await createItem({
        name: form.name.trim(),
        category: form.category,
        location: form.location.trim(),
        status: type,
      });
      setForm({ ...form, name: "", location: "" });
      onDone();
    } catch {
      alert("โพสต์ไม่สำเร็จ เช็ค item-service");
    } finally {
      setSending(false);
    }
  }

  return (
    <form id="report" onSubmit={handleSubmit}>
      <h2>แจ้งของหาย / ของเจอ</h2>

      <div className="type-toggle">
        <button
          type="button"
          className={isLost ? "active lost" : ""}
          onClick={() => onTypeChange("lost")}
        >
          <Frown size={20} /> แจ้งของหาย
        </button>
        <button
          type="button"
          className={!isLost ? "active found" : ""}
          onClick={() => onTypeChange("found")}
        >
          <Smile size={20} /> แจ้งของเจอ
        </button>
      </div>

      <label>ชื่อสิ่งของ *</label>
      <input value={form.name} onChange={set("name")} placeholder="เช่น กระเป๋าสตางค์สีดำ" />

      <label>หมวดหมู่ *</label>
      <select value={form.category} onChange={set("category")}>
        {FORM_CATEGORIES.map((c) => (
          <option key={c.name}>{c.name}</option>
        ))}
      </select>

      <label>{isLost ? "สถานที่ที่หาย *" : "สถานที่ที่พบ *"}</label>
      <input value={form.location} onChange={set("location")} placeholder="เช่น อาคาร 5 ชั้น 2" />

      <button type="submit" className="submit" disabled={sending}>
        <Send size={18} /> {sending ? "กำลังส่ง..." : "ส่งประกาศ"}
      </button>
    </form>
  );
}