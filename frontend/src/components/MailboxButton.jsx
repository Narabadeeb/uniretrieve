export default function MailboxButton({ label, onClick }) {
  return (
    <button type="button" className="mailbox-btn" onClick={onClick}>
      <svg width="56" height="56" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="mbBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6c5ce7" />
            <stop offset="1" stopColor="#4f8cff" />
          </linearGradient>
        </defs>
        {/* เสา */}
        <rect x="29" y="40" width="6" height="20" rx="2" fill="#8b8fc7" />
        <rect x="21" y="58" width="22" height="4" rx="2" fill="#8b8fc7" />
        {/* จดหมายโผล่ที่ช่อง */}
        <g className="letter">
          <rect x="22" y="14" width="18" height="12" rx="2" fill="#fff" stroke="#c7c9f0" />
          <path d="M22 16 L31 22 L40 16" fill="none" stroke="#c7c9f0" />
        </g>
        {/* ตัวตู้ */}
        <path d="M10 40 V28 a18 18 0 0 1 18 -18 h8 a18 18 0 0 1 18 18 V40 a2 2 0 0 1 -2 2 H12 a2 2 0 0 1 -2 -2 Z" fill="url(#mbBody)" />
        {/* ช่องหยอด */}
        <rect x="18" y="30" width="28" height="4" rx="2" fill="#2e2a72" opacity="0.55" />
        {/* ธง */}
        <g className="flag">
          <rect x="45" y="14" width="3" height="22" rx="1.5" fill="#ff5d73" />
          <path d="M48 14 h9 l-3 4 l3 4 h-9 Z" fill="#ff5d73" />
        </g>
      </svg>
      <span>{label}</span>
    </button>
  );
}
