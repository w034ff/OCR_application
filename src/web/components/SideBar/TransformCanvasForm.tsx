import { useEditCanvasToolsContext } from '../../hooks/editFabricCanvasHooks/EditCanvasToolsContext';
import { useSidebarStateContext } from './SidebarStateContext';
import { useSetModalContext } from '../ModalWindow/ModalWindowContext';
import { useTransformCanvas } from './useTransformCanvas';
import ResizeInputField from './ResizeInputField';
import Checkbox from './Checkbox';
import RotateFlipButtons from './RotateFlipButtons';

const TransformCanvasForm = (): JSX.Element => {
  const { setModalMode } = useSetModalContext();
  const {
    lockTrimAspectRatio, setLockTrimAspectRatio, lockResizeAspectRatio, setLockResizeAspectRatio,
  } = useEditCanvasToolsContext();
  const { trimModeActive, setTrimModeActive, resizeModeActive } = useSidebarStateContext();

  console.log('render TransformCanvasForm');
  
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
      <div className="horizontal-group margin-top">
        <div className="group-text">幅</div>
        <div className="group-text">高さ</div>
      </div>
      <div className="horizontal-group margin-top">
        <ResizeInputField name="width" value={inputs.width} onChange={handleInputChange} onBlur={handleInputBlur} onKeyUp={handleKeyUp} />
        <ResizeInputField name="height" value={inputs.height} onChange={handleInputChange} onBlur={handleInputBlur} onKeyUp={handleKeyUp} />
      </div>
      {trimModeActive && (
        <>
          <Checkbox id="trim" checked={lockTrimAspectRatio} onChange={(e) => setLockTrimAspectRatio(e.target.checked)} label="縦横比を固定する" />
          <div className="horizontal-group two-buttons">
            <button onClick={() => setTrimModeActive(false)}>キャンセル</button>
            <button onClick={handleChangeClick}>完了</button>
          </div>
        </>
      )}
      {resizeModeActive && (
        <>
          <Checkbox id="resize" checked={lockResizeAspectRatio} onChange={(e) => setLockResizeAspectRatio(e.target.checked)} label="縦横比を固定する" />
          <div className="horizontal-group modal-open">
            <button onClick={() => setModalMode('resize-canvas')}>画像をリサイズする</button>
          </div>
          <div className="text">回転と反転</div>
          <RotateFlipButtons />
        </>
      )}  
    </div>
  );
}

export default TransformCanvasForm
