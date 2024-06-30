
interface AspectRatioCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

const Checkbox = ({ id, checked, onChange, label }: AspectRatioCheckboxProps): JSX.Element => {
  return (
    <div className="checkbox">
      <input
        type="checkbox"
        id={id}
        className="custom-checkbox"
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id} className="custom-label">{label}</label>
    </div>
  );
};

export default Checkbox;
