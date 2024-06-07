import RotateFlipButtons from './RotateFlipButtons';
import { useEditCanvasToolsContext } from '../../hooks/editFabricCanvasHooks/EditCanvasToolsContext';
import { useSidebarStateContext } from './SidebarStateContext';
import { useCanvasModalWindowContext } from '../modalWindow/CanvasModalWindowContext';
import { useTransformCanvas } from './useTransformCanvas';


const TransformCanvasForm = (): JSX.Element => {
  const { setCanvasModalMode } = useCanvasModalWindowContext();
  const {
    isTrimAspectRatioLocked, setIsTrimAspectRatioLocked, isResizeAspectRatioLocked, setIsResizeAspectRatioLocked,
  } = useEditCanvasToolsContext();
  const { trimModeActive, setTrimModeActive, resizeModeActive } = useSidebarStateContext();
  
  // トリミング領域と入力された数値を管理するカスタムフック
  const { 
    inputs,
    handleInputBlur,
    handleKeyUp,
    handleInputChange,
    handleChangeClick
  } = useTransformCanvas();


  return (
    <div className="sidebar-content">
      <h3>キャンバス</h3>
      <div className="text">キャンバスのサイズ変更</div>
      <div className="horizontal-group horizontal-group-small">
        <div className="group-text">幅</div>
        <div className="group-text">高さ</div>
      </div>
      <div className="horizontal-group horizontal-group-small">
        <div className="input-wrapper">
          <input 
            type="text"
            name="width"
            value={inputs.width} 
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyUp={handleKeyUp}
            maxLength={5}
            onFocus={(e) => e.target.select()}
            onDragStart={(e) => e.preventDefault()}
          />
          <span className="unit-text">ピクセル</span>
        </div>
        <div className="input-wrapper">
          <input 
            type="text"
            name="height"
            value={inputs.height} 
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyUp={handleKeyUp}
            maxLength={5}
            onFocus={(e) => e.target.select()}
            onDragStart={(e) => e.preventDefault()}
          />
          <span className="unit-text">ピクセル</span>
        </div>
      </div>
      {trimModeActive && (
        <>
          <div className="checkbox">
            <input 
              type="checkbox"
              id="trimAspectRatio"
              className="custom-checkbox"
              checked={isTrimAspectRatioLocked}
              onChange={(e) => setIsTrimAspectRatioLocked(e.target.checked)}
            />
            <label htmlFor="trimAspectRatio" className="custom-label">縦横比を固定する</label>
          </div>
          <div className="horizontal-group horizontal-group-two-buttons">
            <button onClick={() => setTrimModeActive(false)}>キャンセル</button>
            <button onClick={handleChangeClick}>完了</button>
          </div>
        </>
      )}
      {resizeModeActive && (
        <>
          <div className="checkbox">
            <input 
              type="checkbox"
              id="resizeAspectRatio"
              className="custom-checkbox"
              checked={isResizeAspectRatioLocked}
              onChange={(e) => setIsResizeAspectRatioLocked(e.target.checked)}
            />
            <label htmlFor="resizeAspectRatio" className="custom-label">縦横比を固定する</label>
          </div>
          <div className="horizontal-group modal-open">
            <button onClick={() => setCanvasModalMode('resize-canvas')}>画像をリサイズする</button>
          </div>
          <div className="text">回転と反転</div>
          <RotateFlipButtons />
        </>
      )}  
    </div>
  );
}

export default TransformCanvasForm
