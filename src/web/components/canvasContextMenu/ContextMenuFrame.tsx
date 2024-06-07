import '../../styles/ContextMenu.css'; 
import { useCanvasToolsContext } from '../../CanvasToolsContext';
import { useContextMenuContext } from './ContextMenuContext';
import { ContextMenuItems } from './ContextMenuItems';
import ContextMenuItem from './ContextMenuItem';


const CanvasContextMenuFrame = (): JSX.Element  => {
  const { contextMenu } = useContextMenuContext();
  const { scale, setScale, handleScrollbarToCenter, setScaleUpdateFlag } = useCanvasToolsContext();

  const triggerViewReset = () => {
    if (scale === 1.0) {
      handleScrollbarToCenter();
    } else {
      setScale(1.0);
      setScaleUpdateFlag(flag => !flag);
    }
  };
  
  const contextMenuStyle: React.CSSProperties = contextMenu.visible
    ? { left: `${contextMenu.x}px`, top: `${contextMenu.y}px` } 
    : { visibility: 'hidden', opacity: 0 };

  return (
    <div>
      {contextMenu.visible && <div className="modal-background" />}
      <div className="contextMenu" style={contextMenuStyle}>
        {ContextMenuItems.map((item, index) => (
          <ContextMenuItem key={index} icon={item.icon} text={item.text}
            divider={item.divider} ViewReset={triggerViewReset}
          />
          ))}
      </div>
    </div>
  );
};

export default CanvasContextMenuFrame;
