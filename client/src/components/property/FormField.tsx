interface FormFieldProps {
  label: string;
  icon: React.ReactNode;
  type: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}

// The repeated "label above an icon + input pill" row used across the
// listing form. Only covers the plain single-input case - fields with a
// datalist, textarea, or file input stay bespoke since they don't fit this
// shape.
const FormField: React.FC<FormFieldProps> = ({
  label,
  icon,
  type,
  placeholder,
  value,
  onChange,
  required,
  className = "",
}) => (
  <label
    className={`flex flex-col gap-2 text-sm text-slate-200 ${className}`}
  >
    {label}
    <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primary-400">
      {icon}
      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  </label>
);

export default FormField;
