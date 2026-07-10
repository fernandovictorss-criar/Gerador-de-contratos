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
      className="text-xs text-neutral-400 hover:text-white underline cursor-pointer"
    >
      Sair
    </button>
  );
}
