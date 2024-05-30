import { useEffect, useState } from 'react';
import { useHistoryContext } from '../../CanvasHistoryContext';
import RotateFlipButtons from './RotateFlipButtons';
import { useEditCanvasToolsContext } from '../canvasTrimHooks/EditCanvasToolsContext';
import { useSidebarStateContext } from './SidebarStateContext';
import { useScaleModalWindowContext } from '../guidebar/ScaleModalWindowContext';
import { useValidateAndAdjustSize } from './useValidateAndAdjustSize';


const ResizeCanvasForm = (): JSX.Element => {
  const { setIsSaveState } = useHistoryContext();
  const { setScaleModalMode } = useScaleModalWindowContext();
  const {
    setIsTrimCanvas, setTrimRegionChanged,
    currentCanvasWidth, currentCanvasHeight, isTrimAspectRatioLocked, setIsTrimAspectRatioLocked,
    trimRegionWidth, setTrimRegionWidth, trimRegionHeight, setTrimRegionHeight,
  } = useEditCanvasToolsContext();
  const { 
    trimModeActive, setTrimModeActive, resizeModeActive, isResizeAspectRatioLocked,
    setIsResizeAspectRatioLocked,
  } = useSidebarStateContext();
  const [inputs, setInputs] = useState<Inputs>({ width: currentCanvasWidth.toString(), height: currentCanvasHeight.toString() });
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [inputChanged, setInputChanged] = useState<boolean>(false);
  const [isEnterPressed, setIsEnterPressed] = useState<boolean>(false);

  // 入力されたトリミングサイズの検証及びオプションでアスペクト比を維持しながらサイズを調整するカスタムフック
  const validateAndAdjustSize = useValidateAndAdjustSize(inputs, setInputs, setInputChanged, aspectRatio);


  // トリミングをクリックするとトリミング領域を初期化する
  useEffect(() => {
    setTrimRegionWidth(currentCanvasWidth);
    setTrimRegionHeight(currentCanvasHeight);
  }, [trimModeActive, resizeModeActive, currentCanvasWidth, currentCanvasHeight]);

  // RectTrimPreviewで更新されたトリミング領域をinputsに適用する
  useEffect(() => {
    setInputs({ width: trimRegionWidth.toString(), height: trimRegionHeight.toString() });
  }, [trimRegionWidth, trimRegionHeight]);

  // トリミング領域をプレビューに適用する
  useEffect(() => {
    setTrimRegionWidth(parseInt(inputs.width, 10));
    setTrimRegionHeight(parseInt(inputs.height, 10));
    setTrimRegionChanged(flag => !flag);
  }, [inputChanged]);
  
  // チェックボックスをクリックするとアスペクト比を更新する
  useEffect(() => {
    if (isResizeAspectRatioLocked) {
      setAspectRatio(currentCanvasWidth / currentCanvasHeight);
    } else if (isTrimAspectRatioLocked) {
      setAspectRatio(trimRegionWidth / trimRegionHeight);
    }
  }, [isTrimAspectRatioLocked, isResizeAspectRatioLocked]);


  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (isEnterPressed) {
      setIsEnterPressed(false);
      return;
    }
    const { name, value } = e.target;
    validateAndAdjustSize(name, value);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEnterPressed(true);
      const { name, value } = e.currentTarget;
      validateAndAdjustSize(name, value);
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleChangeClick = () => {
    setIsTrimCanvas(flag => !flag);
    setIsSaveState(flag => !flag);  // SaveStateを更新(ここで呼び出さないと正しくキャンバスの状態を保存できない)
  }

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
            <button onClick={() => setScaleModalMode('image-scaling')}>画像をリサイズする</button>
          </div>
          <div className="text">回転と反転</div>
          <RotateFlipButtons />
        </>
      )}  
    </div>
  );
}

export default ResizeCanvasForm
