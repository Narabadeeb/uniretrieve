const ITEM_API = import.meta.env.VITE_ITEM_API;

export async function getItems() {
  const res = await fetch(`${ITEM_API}/items`);
  if (!res.ok) throw new Error("โหลดรายการไม่สำเร็จ");
  return res.json();
}

export async function createItem(body) {
  const res = await fetch(`${ITEM_API}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("โพสต์ไม่สำเร็จ");
  return res.json();
}