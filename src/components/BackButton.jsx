export default function BackButton({ label, onClick, style }) {
  return (
    <div className="back-wrap" style={style}>
      <button className="back-btn" onClick={onClick}>
        <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        {label}
      </button>
    </div>
  );
}
