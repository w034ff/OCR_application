import { useCanvasToolsContext } from '../../CanvasToolsContext';
import { useCanvasModalWindowContext } from '../modalWindow/CanvasModalWindowContext';
import { useSidebarStateContext } from '../sidebar/SidebarStateContext';
import { getNextScale } from '../../utils/scaleUtils';
import { useScaleUpdate } from '../../hooks/ScaleUpdate';
import Slider from '../Slider/Slider';


interface GuideItemProps {
  icon?: string;
  svg?: JSX.Element;
  text: string;
  onClick?: (e: React.MouseEvent) => void;
}

const GuideItem: (props: GuideItemProps) => JSX.Element = ({ icon, svg, text, onClick }) => {
  const { scale } = useCanvasToolsContext();
  const { setTrimModeActive, setResizeModeActive } = useSidebarStateContext();
  const { setCanvasModalMode } = useCanvasModalWindowContext();

  // console.log("render GuideItem")

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
      setCanvasModalMode('zoom-canvas');
    }
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
        <Slider type={'guidebar'} />
      )}
    </div>
    </>
  );
}

export default GuideItem;
