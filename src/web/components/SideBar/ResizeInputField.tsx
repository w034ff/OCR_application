
interface ResizeInputFieldProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const ResizeInputField = ({ name, value, onChange, onBlur, onKeyUp }: ResizeInputFieldProps): JSX.Element => {
  return (
    <div className="input-wrapper">
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onKeyUp={onKeyUp}
        maxLength={5}
        onFocus={(e) => e.target.select()}
        onDragStart={(e) => e.preventDefault()}
      />
      <span className="unit-text">ピクセル</span>
    </div>
  );
};

export default ResizeInputField;
