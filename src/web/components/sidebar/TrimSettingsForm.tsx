import React, { JSX, useEffect, useState } from 'react';
import './Sidebar.css';
import { useHistoryContext } from '../../CanvasHistoryContext';
import { useGuideBarToolsContext } from './GuideBarToolsContext';
import { useSidebarStateContext } from './SidebarStateContext';
import { useValidateAndAdjustSize } from './ValidateAndAdjustSize';


const TrimSettingsForm = (): JSX.Element => {
  const { setIsSaveState } = useHistoryContext();
  const {
    setIsTrimCanvas, setTrimRegionChanged,
    currentCanvasWidth, currentCanvasHeight, isTrimAspectRatioLocked, setIsTrimAspectRatioLocked,
    trimRegionWidth, setTrimRegionWidth, trimRegionHeight, setTrimRegionHeight
  } = useGuideBarToolsContext();
  const { trimModeActive, setTrimModeActive } = useSidebarStateContext();
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
  }, [trimModeActive]);

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
    if (isTrimAspectRatioLocked) {
      setAspectRatio(trimRegionWidth / trimRegionHeight);
    }
  }, [isTrimAspectRatioLocked]);


  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTrimAspectRatioLocked(e.target.checked);
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

  const handleCloseClick = (e: React.MouseEvent) => {
    setTrimModeActive(false);
  }

  const handleChangeClick = (e: React.MouseEvent) => {
    setIsTrimCanvas(flag => !flag);
    setIsSaveState(flag => !flag);  // SaveStateを更新(ここで呼び出さないと正しくキャンバスの状態を保存できない)
  }

  return (
    <div className="sidebar-content">
      <h3>トリミング</h3>
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
        <input type="checkbox" id="AspectRatio" className="custom-checkbox" checked={isTrimAspectRatioLocked} onChange={handleCheckboxChange} />
        <label htmlFor="AspectRatio" className="custom-label">縦横比を固定する</label>
      </div>
      <div className="horizontal-group horizontal-group-two-buttons">
        <button onClick={handleCloseClick}>キャンセル</button>
        <button onClick={handleChangeClick}>完了</button>
      </div>
    </div>
  );
}

export default TrimSettingsForm
