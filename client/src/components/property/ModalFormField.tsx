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
  <label className={`block ${className}`}>
    <span className="field-label">{label}</span>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="field"
      required={required}
    />
  </label>
);

export default ModalFormField;
