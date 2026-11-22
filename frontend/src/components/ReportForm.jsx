import { useState } from "react";
import { Send, ImagePlus, X } from "lucide-react";
import { createItem } from "../api";
import { CATEGORIES } from "../categories";

const FORM_CATEGORIES = CATEGORIES.filter((c) => c.name !== "ทั้งหมด");

function resizeImage(file, maxSize = 800, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function ReportForm({ type, onDone }) {
  const [form, setForm] = useState({ name: "", category: FORM_CATEGORIES[0].name, location: "" });
  const [image, setImage] = useState(null);
  const [sending, setSending] = useState(false);

  const isLost = type === "lost";
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("เลือกได้เฉพาะไฟล์รูปภาพ");
      return;
    }
    try {
      setImage(await resizeImage(file));
    } catch {
      alert("อ่านรูปไม่สำเร็จ ลองรูปอื่น");
    }
  }

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
        image,
      });
      setForm({ ...form, name: "", location: "" });
      setImage(null);
      onDone();
    } catch {
      alert("โพสต์ไม่สำเร็จ เช็ค item-service");
    } finally {
      setSending(false);
    }
  }

  return (
    <form id="report" onSubmit={handleSubmit}>
      <h2>{isLost ? "แจ้งของหาย" : "แจ้งของเจอ"}</h2>

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

      <label>รูปภาพ (ไม่บังคับ)</label>
      {image ? (
        <div style={{ position: "relative", width: 160 }}>
          <img src={image} alt="พรีวิว" style={{ width: 160, height: 160, objectFit: "cover", borderRadius: 14 }} />
          <button
            type="button"
            onClick={() => setImage(null)}
            aria-label="ลบรูป"
            style={{ position: "absolute", top: 6, right: 6, border: "none", borderRadius: "50%",
              width: 28, height: 28, cursor: "pointer", background: "rgba(0,0,0,.6)", color: "#fff" }}
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
          padding: "10px 14px", border: "1px dashed #b9b9e8", borderRadius: 12, width: "fit-content" }}>
          <ImagePlus size={18} /> เลือกรูป
          <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
        </label>
      )}

      <button type="submit" className="submit" disabled={sending}>
        <Send size={18} /> {sending ? "กำลังส่ง..." : "ส่งประกาศ"}
      </button>
    </form>
  );
}
