import { MapPin, CalendarDays, ChevronRight, CircleAlert, CircleCheck } from "lucide-react";
import { categoryIcon, normalizeCategory } from "../categories";

const STATUS = {
  lost: { text: "หาย", cls: "lost", Icon: CircleAlert },
  found: { text: "พบแล้ว", cls: "found", Icon: CircleCheck },
  returned: { text: "คืนแล้ว", cls: "returned", Icon: CircleCheck },
};

export default function ItemCard({ item }) {
  const st = STATUS[item.status] || { text: item.status, cls: "returned", Icon: CircleCheck };
  const StatusIcon = st.Icon;
  const Thumb = categoryIcon(item.category);
  const date = new Date(item.createdAt).toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <article className="card">
      <div className={`thumb ${st.cls}`} style={item.image ? { padding: 0, overflow: "hidden" } : undefined}>
        {item.image ? (
          <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Thumb size={34} />
        )}
      </div>
      <div className="card-main">
        <h3>{item.name}</h3>
        <p className="meta-line">
          <MapPin size={14} /> {item.location}
        </p>
        <span className="cat-tag">หมวดหมู่: {normalizeCategory(item.category)}</span>
      </div>
      <div className="card-side">
        <span className="meta-line">
          <CalendarDays size={14} /> {date}
        </span>
        <span className={`badge ${st.cls}`}>
          <StatusIcon size={16} /> {st.text}
        </span>
      </div>
      <ChevronRight className="chev" size={20} />
    </article>
  );
}
