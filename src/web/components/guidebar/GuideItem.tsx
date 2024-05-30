import { useState } from 'react';
import { useCanvasToolsContext } from '../../CanvasToolsContext';
import { useScaleModalWindowContext } from './ScaleModalWindowContext';
import { useSidebarStateContext } from '../sidebar/SidebarStateContext';
import { getNextScale } from '../../utils/scaleUtils';
import { useAlertSound } from '../../hooks/AlertSound';
import { useScaleUpdate } from '../../hooks/ScaleUpdate';


interface GuideItemProps {
  icon?: string;
  svg?: JSX.Element;
  text: string;
  onClick?: (e: React.MouseEvent) => void;
}

const GuideItem: (props: GuideItemProps) => JSX.Element = ({ icon, svg, text, onClick }) => {
  const { scale } = useCanvasToolsContext();
  const { setTrimModeActive, setResizeModeActive } = useSidebarStateContext();
  const { setScaleModalMode } = useScaleModalWindowContext();
  const [isHovered, setIsHovered] = useState(false);
  const [isGrabbed, setIsGrabbed] = useState(false);
  const [isThumbHovered, setIsThumbHovered] = useState(false);
  const [isThumbActive, setIsThumbActive] = useState(false);

  // console.log("render GuideItem")

  const playAlertSound = useAlertSound(); // アラートを再生するカスタムフック
  const updateScale = useScaleUpdate(); // scaleを変更する処理をまとめたカスタムフック
  

  const guideItemClassNames = ['guide-item'];
  if (text.includes('start')) guideItemClassNames.push('start');
  if (text === 'scale') guideItemClassNames.push('display-scale');
  if (text.includes('handle-scale')) guideItemClassNames.push('plus-minus-scale');
  if (text === 'slider') guideItemClassNames.push('slider');

  const guideItemClasses = guideItemClassNames.join(' ');

  const handleItemClick = (e: React.MouseEvent) => {
    if (text === 'start-選択') {
      setTrimModeActive(false);
      setResizeModeActive(false);
    } else if (text === 'start-トリミング') {
      setResizeModeActive(false);
      setTrimModeActive(true);
    } else if (text === 'handle-scale-minus' && scale > 0.1) {
      updateScale(getNextScale(scale, -1));
    } else if (text === 'handle-scale-plus' && scale < 64.0) {
      updateScale(getNextScale(scale, 1));
    } else if (text === 'scale'){
      setScaleModalMode('canvas-scaling');
    // } else {
    //   if (onClick && !(isRedoDisabled && text === 'やり直し') && !(isUndoDisabled && text === '元に戻す')) {
    //     onClick(e);
    //   }
    }
  };

  // スライダーの値からスケール値への変換
  const sliderValueToScale = (sliderValue: number) => {
    if (sliderValue === 0) return 1; // 中央の値
    if (sliderValue < 0) {
      return 1 + sliderValue * (1 - 0.1); // スライダーの値が負の場合（左側）、0.1から1まで
    } else {
      return 1 + sliderValue * (4 - 1); // スライダーの値が正の場合（右側）、1から4まで
    }
  };

  // スケール値からスライダーの値への変換
  const scaleToSliderValue = (scale: number) => {
    if (scale === 1) return 0; // 中央の値
    if (scale < 1) {
      return (scale - 1) / (1 - 0.1); // スケールが1未満の場合
    } else {
      return (scale - 1) / (4 - 1); // スケールが1より大きい場合
    }
  };

  const handleScaleChange = (newScale: number) => {
    newScale = Math.floor(newScale * 100) / 100; // 小数点以下第二位で丸める
    newScale = Math.max(0.1, Math.min(4, newScale)); // 0.1から4の範囲に制限する
    
    updateScale(newScale);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    playAlertSound();
  };

  const scaledSliderValue = (scaleToSliderValue(scale) + 1) * 50;
  const trackBackground = `linear-gradient(90deg, #0064b6 0%, #0064b6 ${scaledSliderValue}%, #bcbcbc ${scaledSliderValue}%, #bcbcbc 100%)`;
  const hoverTrackBackground = `linear-gradient(90deg, #0064b6 ${scaledSliderValue}%, #606161 ${scaledSliderValue}%, #606161 100%)`;
  const grabTrackBackground = `linear-gradient(90deg, #0064b6 0%, #0064b6 ${scaledSliderValue}%, #909192 ${scaledSliderValue}%, #909192 100%)`;
  const sliderStyle: React.CSSProperties & { '--thumb-bg': string } = {
      position: 'absolute', 
      width: '100%', 
      height: '2px',
      zIndex: 2, 
      pointerEvents: 'none', 
      background: isGrabbed ? grabTrackBackground : (isHovered ? hoverTrackBackground : trackBackground),
      '--thumb-bg': isThumbActive ? '#cccccc' : (isThumbHovered ? '#171717' : '#0064b6')
  };

  const titleClassNames = [''];
  if (text === 'handle-scale-minus') titleClassNames.push('縮小');
  if (text === 'handle-scale-plus') titleClassNames.push('拡大');
  if (text === 'scale') titleClassNames.push('ズームを調整します');
  
  const title_texts = titleClassNames.join(' ');

  return (
    <>
    <div className={guideItemClasses} title={title_texts} onClick={handleItemClick}>
      {text.includes('start') && (
        <>
          <img src={icon} alt={text} className="icon" width="16" height="16" />
          <div className="start-text">{text.replace('start-', '')}</div>
        </>
      )}
      {text.includes('handle-scale') && (
        <img src={icon} alt={text} className="icon" width="16" height="16" />
      )}
      {text === 'scale' && (
        <div className="scale-text">
          <span className="scale-value">{(scale * 100).toFixed(0)}</span><span>%</span>
        </div>
      )}
      {text === 'slider' && (
         <div className='slider-style' title='ズームを調整します'>
          <input
            type="range"
            min={scaleToSliderValue(0.1)}
            max={scaleToSliderValue(4)}
            value={scaleToSliderValue(scale)}
            readOnly
            step="0.02"
            style={sliderStyle}
          />
          <input
            type="range"
            min={scaleToSliderValue(0.1)}
            max={scaleToSliderValue(4)}
            step="0.02"
            value={scaleToSliderValue(scale)}
            onChange={(e) => handleScaleChange(sliderValueToScale(parseFloat(e.target.value)))}
            onMouseDown={() => { setIsGrabbed(true); setIsThumbActive(true); }}
            onMouseUp={() => { setIsGrabbed(false); setIsThumbActive(false); }}
            onMouseEnter={() => { setIsHovered(true); setIsThumbHovered(true); }}
            onMouseLeave={() => { setIsHovered(false); setIsThumbHovered(false); }}
            onKeyDown={handleKeyDown}
            style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                      width: '100%', zIndex: 1, opacity: 0, height: '24px' }}
          />
        </div>
      )}
    </div>
    </>
  );
}

export default GuideItem;
