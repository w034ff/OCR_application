import React, { JSX, useEffect, useState } from 'react';
import './Sidebar.css';
import RotateObjectIcon from '../assets/svgs/RotateObjectIcon';
import FlipObjectIcon from '../assets/svgs/FlipObjectIcon';
import { useHistoryContext } from '../../CanvasHistoryContext';
import { useGuideBarToolsContext } from './GuideBarToolsContext';
import { useSidebarStateContext } from './SidebarStateContext';
import { useScaleModalWindowContext } from '../guidebar/ScaleModalWindowContext';
import { useValidateAndAdjustSize } from './ValidateAndAdjustSize';


const ResizeCanvasForm = (): JSX.Element => {
  const { setIsSaveState } = useHistoryContext();
  const { setScaleModalMode } = useScaleModalWindowContext();
  const {
    setTrimRegionChanged,
    currentCanvasWidth, currentCanvasHeight,
    trimRegionWidth, setTrimRegionWidth, trimRegionHeight, setTrimRegionHeight,
    setRotate90, setFlipState
  } = useGuideBarToolsContext();
  const { 
    resizeModeActive, isResizeAspectRatioLocked, setIsResizeAspectRatioLocked,
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
  }, [resizeModeActive, currentCanvasWidth, currentCanvasHeight]);

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
    }
  }, [isResizeAspectRatioLocked]);


  const handleCheckboxAspect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsResizeAspectRatioLocked(e.target.checked);
  };


  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (isEnterPressed) {
      setIsEnterPressed(false);
      return;
    }
    const { name, value } = e.target;
    validateAndAdjustSize(name, value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  const handleModalOpen = () => {
    setScaleModalMode('image-scaling');
  }

  const handleRotateAndFlip = (setAction: React.Dispatch<React.SetStateAction<number>>, direction: number) => {
    setAction(prev => prev + direction);
    setIsSaveState(flag => !flag);
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
            onKeyPress={handleKeyPress}
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
            onKeyPress={handleKeyPress}
            maxLength={5}
            onFocus={(e) => e.target.select()}
            onDragStart={(e) => e.preventDefault()}
          />
          <span className="unit-text">ピクセル</span>
        </div>
      </div>
      <div className="checkbox">
        <input type="checkbox" id="AspectRatio" className="custom-checkbox" checked={isResizeAspectRatioLocked} onChange={handleCheckboxAspect} />
        <label htmlFor="AspectRatio" className="custom-label">縦横比を固定する</label>
      </div>
      <div className="horizontal-group modal-open">
        <button onClick={handleModalOpen}>画像をリサイズする</button>
      </div>
      <div className="text">回転と反転</div>
      <div className="horizontal-group horizontal-four-buttons">
        <button onClick={() => handleRotateAndFlip(setRotate90, -1)}>
          <RotateObjectIcon className='button-icon' />
        </button>
        <button onClick={() => handleRotateAndFlip(setRotate90, +1)}>
          <RotateObjectIcon className='button-icon' style={{ transform: "scaleX(-1)" }} />
        </button>
        <button onClick={() => handleRotateAndFlip(setFlipState, -1)}>
          <FlipObjectIcon className='button-icon'/>
        </button>
        <button onClick={() => handleRotateAndFlip(setFlipState, +1)}>
          <FlipObjectIcon className='button-icon' style={{ transform: "rotate(270deg)" }} />
        </button>
      </div>
    </div>
  );
}

export default ResizeCanvasForm
