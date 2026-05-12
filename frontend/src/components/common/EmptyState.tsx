interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon = "📭", title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div
        className="flex items-center justify-center w-14 h-14 rounded-2xl text-2xl"
        style={{ background: "#1A1A24", border: "1px solid #2A2A38" }}
      >
        {icon}
      </div>
      <p className="text-[14px] font-semibold text-white">{title}</p>
      {description && (
        <p className="text-[12px] text-center max-w-xs" style={{ color: "#4A4A5E" }}>
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-1 px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-indigo-500 hover:bg-indigo-600 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
