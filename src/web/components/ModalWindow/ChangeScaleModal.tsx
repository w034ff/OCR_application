
interface ChangeScaleModalProps {
  title: string;
  radioValues: number[];
  selectedScale: number;
  handleScaleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeClick: () => void;
  closeModal: () => void;
}

const ChangeScaleModal = ({
  title, radioValues, selectedScale, handleScaleChange, handleChangeClick, closeModal
}: ChangeScaleModalProps): JSX.Element  => {
  return (
    <>
      <button className="close-button" onClick={closeModal}>×</button>
        <h3>{title}</h3>
        <form>
          {radioValues.map((optionScale) => (
            <div key={optionScale.toString()} className="scale-option">
              <label>
                <input
                  type="radio"
                  name="scale"
                  value={optionScale}
                  checked={selectedScale === optionScale}
                  onChange={handleScaleChange}
                />
                {optionScale * 100}%
              </label>
            </div>
          ))}
        </form>
        <div className="button-group">
          <button onClick={handleChangeClick}>OK</button>
          <button onClick={closeModal}>キャンセル</button>
        </div>
    </>
  );
};

export default ChangeScaleModal;
