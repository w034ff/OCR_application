import '../../styles/modal-window.css';
import { useState } from 'react';
import { useSaveStateContext } from '../../CanvasSaveStateContext';
import { useCanvasModalWindowContext } from './CanvasModalWindowContext';
import { useAlertSound } from '../../hooks/useAlertSound';
import { useChangeScaleModal } from './useChangeScaleModal';


const zoomRatioValues: number[] = [
  0.33, 0.5, 0.66, 1.0, 2.0, 4.0
];

const resizeRatioValues: number[] = [
  0.25, 0.5, 0.75, 1.5, 2.0, 4.0
]

const CanvasModalWindow = (): JSX.Element | null  => {
  const { setIsSaveState } = useSaveStateContext();
  const { canvasModalMode, setCanvasModalMode } = useCanvasModalWindowContext();
  const [selectedScale, setSelectedScale] = useState<number>(1);
  const [animationKey, setAnimationKey] = useState(0); 
  const playAlertSound = useAlertSound();
  const { applyZoomCanvas, applyResizeCanvas } = useChangeScaleModal(setSelectedScale);
  let inputRadioArray: number[] = zoomRatioValues;
  let modalTitle: string = 'キャンバスの倍率を調整します';

  console.log('render modalWindow');
  

  if (canvasModalMode !== 'zoom-canvas' && canvasModalMode !== 'resize-canvas') {
    return null;
  }

  if (canvasModalMode === 'resize-canvas') {
    inputRadioArray = resizeRatioValues;
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
    setCanvasModalMode("");
    setAnimationKey(0);
  };
  
  const handleChangeClick = () => {
    closeModal();
    if (canvasModalMode === 'zoom-canvas') {
      applyZoomCanvas(selectedScale);
    } else if (canvasModalMode === 'resize-canvas') {
      setIsSaveState(flag => !flag); 
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
