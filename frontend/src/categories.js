import { LayoutGrid, ShoppingBag, Smartphone, Key, FileText, Shirt, Sparkles } from "lucide-react";

export const CATEGORIES = [
  { name: "ทั้งหมด", icon: Sparkles },
  { name: "กระเป๋า", icon: ShoppingBag },
  { name: "โทรศัพท์", icon: Smartphone },
  { name: "กุญแจ", icon: Key },
  { name: "เอกสาร", icon: FileText },
  { name: "เสื้อผ้า", icon: Shirt },
  { name: "อื่นๆ", icon: LayoutGrid },
];

// หมวดเก่าที่เคยบันทึกไว้ในฐานข้อมูล แปลงเป็นหมวดใหม่
const LEGACY = { "กระเป๋าสตางค์": "กระเป๋า" };

export function normalizeCategory(raw) {
  const name = LEGACY[raw] || raw;
  const known = CATEGORIES.some((c) => c.name === name && c.name !== "ทั้งหมด");
  return known ? name : "อื่นๆ";
}

export function categoryIcon(raw) {
  const name = normalizeCategory(raw);
  return CATEGORIES.find((c) => c.name === name).icon;
}