interface ModalFormFieldProps {
  label: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}

// Light-themed sibling of FormField, for the light modal forms (as opposed
// to FormField's dark icon-wrapped style used in PropertyListingTab).
const ModalFormField: React.FC<ModalFormFieldProps> = ({
  label,
  type,
  value,
  onChange,
  required,
  className = "",
}) => (
  <label className={`flex flex-col gap-2 text-sm text-slate-700 ${className}`}>
    {label}
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="rounded-2xl border border-slate-200 px-3 py-3 text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none"
      required={required}
    />
  </label>
);

export default ModalFormField;
