import '../../styles/ContextMenu.css'; 
import { useCanvasToolsContext } from '../../CanvasToolsContext';
import { ContextMenuItems } from './ContextMenuItems';
import ContextMenuItem from './ContextMenuItem';

interface ContextMenuFrameProps {
  visible: boolean;
  adjustedX: number;
  adjustedY: number;
  closeEvent: () => void;
}


const ContextMenuFrameComponent: (props: ContextMenuFrameProps) => JSX.Element | null = ({
  visible, adjustedX, adjustedY, closeEvent
}) => {
  const { scale, setScale, handleScrollbarToCenter, setScaleUpdateFlag } = useCanvasToolsContext();

  const triggerViewReset = () => {
    if (scale === 1.0) {
      handleScrollbarToCenter();
    } else {
      setScale(1.0);
      setScaleUpdateFlag(flag => !flag);
    }
  };
  
  const contextMenuStyle: React.CSSProperties = visible
    ? { left: `${adjustedX}px`, top: `${adjustedY}px` } 
    : { visibility: 'hidden', opacity: 0 };

  return (
    <div>
      {visible && <div className="modal-background" />}
      <div className="contextMenu" style={contextMenuStyle}>
        {ContextMenuItems.map((item, index) => (
          <ContextMenuItem key={index} icon={item.icon} text={item.text}
            divider={item.divider} ViewReset={triggerViewReset} closeEvent={closeEvent}
          />
          ))}
      </div>
    </div>
  );
};

export default ContextMenuFrameComponent;
