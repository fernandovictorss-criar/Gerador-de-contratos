"use client";

export function LogoutButton() {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm("Tem certeza que deseja sair?")) {
          e.preventDefault();
        }
      }}
      className="text-xs text-brand-gray hover:text-brand-light underline cursor-pointer"
    >
      Sair
    </button>
  );
}
