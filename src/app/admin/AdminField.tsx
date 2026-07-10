export function AdminField({
  label,
  name,
  type = "text",
  textarea = false,
  defaultValue,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-xs font-bold text-neutral-300 block">
        {label}
        {required && <span className="text-brand-red"> *</span>}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={3}
          defaultValue={defaultValue}
          required={required}
          className="w-full rounded-lg border border-brand-border bg-black px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-green"
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue}
          required={required}
          className="w-full rounded-lg border border-brand-border bg-black px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-green"
        />
      )}
    </div>
  );
}
