"use client";

export function ConfirmButton({
  label,
  confirmMessage,
  className,
}: {
  label: string;
  confirmMessage: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
      className={className ?? "text-xs text-brand-red hover:underline cursor-pointer"}
    >
      {label}
    </button>
  );
}
