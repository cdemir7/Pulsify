export function SkeletonRow({ cols = 6 }: { cols?: number }) {
  return (
    <tr style={{ borderBottom: "1px solid #1A1A24" }}>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 rounded animate-pulse" style={{ background: "#1E1E2E", width: `${60 + (i % 3) * 20}%` }} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl p-4 animate-pulse" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
      <div className="h-3 rounded mb-3" style={{ background: "#1E1E2E", width: "50%" }} />
      <div className="h-7 rounded mb-2" style={{ background: "#1E1E2E", width: "40%" }} />
      <div className="h-2.5 rounded" style={{ background: "#1E1E2E", width: "70%" }} />
    </div>
  );
}
