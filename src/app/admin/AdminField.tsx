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
      <label htmlFor={name} className="text-xs font-bold text-brand-light/80 block">
        {label}
        {required && <span className="text-brand-gold"> *</span>}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={3}
          defaultValue={defaultValue}
          required={required}
          className="w-full rounded-lg border border-brand-border bg-brand-navy px-3 py-2 text-brand-light text-sm focus:outline-none focus:border-brand-gold"
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue}
          required={required}
          className="w-full rounded-lg border border-brand-border bg-brand-navy px-3 py-2 text-brand-light text-sm focus:outline-none focus:border-brand-gold"
        />
      )}
    </div>
  );
}
