import React, { JSX, useState } from 'react';
import { useHistoryContext } from '../../CanvasHistoryContext';
import { useScaleModalWindowContext } from './ScaleModalWindowContext';
import { useAlertSound } from '../../hooks/AlertSound';
import { useScaleChangeModal } from './ScaleChangeModal';


const scaleChangeValues: number[] = [
  0.33, 0.5, 0.66, 1.0, 2.0, 4.0
];

const imageScaleValues: number[] = [
  0.25, 0.5, 0.75, 1.5, 2.0, 4.0
]

const CanvasModalWindow = (): JSX.Element | null  => {
  const { setIsSaveState } = useHistoryContext();
  const { scaleModalMode, setScaleModalMode } = useScaleModalWindowContext();
  const [selectedScale, setSelectedScale] = useState<number>(1);
  const [animationKey, setAnimationKey] = useState(0); 
  const playAlertSound = useAlertSound();
  const { applyScaleChange, applyResizeCanvas } = useScaleChangeModal(setSelectedScale);
  let inputRadioArray: number[] = scaleChangeValues;
  let modalTitle: string = 'キャンバスの倍率を調整します';
  

  if (scaleModalMode !== 'canvas-scaling' && scaleModalMode !== 'image-scaling') {
    return null;
  }

  if (scaleModalMode === 'image-scaling') {
    inputRadioArray = imageScaleValues;
    modalTitle = '画像をリサイズします';
  }


  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playAlertSound();
    setAnimationKey(prevKey => prevKey + 1);
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScale = parseFloat(e.target.value);
    setSelectedScale(newScale);
  };
  
  const closeModal = () => {
    setScaleModalMode("");
    setAnimationKey(0);
  };
  
  const handleChangeClick = () => {
    closeModal();
    if (scaleModalMode === 'canvas-scaling') {
      applyScaleChange(selectedScale);
    } else if (scaleModalMode === 'image-scaling') {
      setIsSaveState((flag: boolean) => !flag); 
      applyResizeCanvas(selectedScale);
    }
  }

  const modalContentClassName = `modal-content ${animationKey > 0 ? 'highlight' : ''}`;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={modalContentClassName} key={animationKey} onClick={(e) => e.stopPropagation()}>
      <button className="close-button" onClick={closeModal}>×</button>
        <h3>{modalTitle}</h3>
        <form>
          {inputRadioArray.map((optionScale) => (
            <div key={optionScale} className="scale-option">
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
      </div>
    </div>
  );
};

export default CanvasModalWindow;
