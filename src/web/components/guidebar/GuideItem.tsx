import { useCanvasToolsContext } from '../../CanvasToolsContext';
import { useCanvasModalWindowContext } from '../modalWindow/CanvasModalWindowContext';
import { useSidebarStateContext } from '../Sidebar/SidebarStateContext';
import { getNextScale } from '../../utils/scaleUtils';
import { useCanvasScaleControls } from '../../hooks/useCanvasScaleControls';
import { useWindowIsActive } from '../../hooks/useWindowIsActive';
import Slider from '../Slider/Slider';


interface GuideItemProps {
  icon?: string;
  text: string;
  title: string;
  className: string;
}

const GuideItem: (props: GuideItemProps) => JSX.Element = ({ icon, text, title, className }) => {
  const { scale } = useCanvasToolsContext();
  const { setTrimModeActive, setResizeModeActive } = useSidebarStateContext();
  const { setCanvasModalMode } = useCanvasModalWindowContext();
  const isActive = useWindowIsActive(); // アプリのアクティブ状態を追跡するカスタムフック
  const { updateScale } = useCanvasScaleControls(); // scaleを変更する処理をまとめたカスタムフック

  // console.log("render GuideItem");


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

  return (
    <>
    <div className={className} title={isActive ? title : ''} onClick={handleItemClick}>
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
