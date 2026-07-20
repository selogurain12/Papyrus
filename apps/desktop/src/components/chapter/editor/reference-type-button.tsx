import { ReactNode } from "react";

interface ReferenceTypeButtonProps {
  icon: ReactNode;
  isActive: boolean;
  label: string;
  onClick: () => void;
}

export function ReferenceTypeButton({ icon, isActive, label, onClick }: ReferenceTypeButtonProps) {
  return (
    <button
      type="button"
      className={
        "flex h-10 items-center justify-center gap-1 rounded-md border text-xs font-medium " +
        (isActive
          ? "border-blue-500 bg-blue-50 text-blue-700"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50")
      }
      onClick={onClick}
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}
