import React, { JSX } from 'react';
import './ContextMenu.css'; 
import { useCanvasToolsContext } from '../../CanvasToolsContext';
import { ContextMenuItems } from './ContextMenuItems';
import ContextMenuItem from './ContextMenuItem';

const MENU_WIDTH = 183;
const MENU_HEIGHT = 278;

interface ContextMenuFrameProps {
  visible: boolean;
  x: number;
  y: number;
  windowWidth: number;
  windowHeight: number;
  closeEvent: () => void;
}

const adjustMenuPosition = (
  x: number, y: number, windowWidth: number, windowHeight: number
): {adjustedX: number, adjustedY: number} => {
  let adjustedX = x;
  let adjustedY = y;
  if (adjustedX + MENU_WIDTH > windowWidth) {
    adjustedX -= MENU_WIDTH;
  }
  if (adjustedY + MENU_HEIGHT > windowHeight) {
    adjustedY -= MENU_HEIGHT;
  }
  return { adjustedX, adjustedY };
};

const ContextMenuFrameComponent: (props: ContextMenuFrameProps) => JSX.Element | null = ({
  visible, x, y, windowWidth, windowHeight, closeEvent
}) => {
  const { adjustedX, adjustedY } = adjustMenuPosition(x, y, windowWidth, windowHeight);
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
          <ContextMenuItem key={index} icon={item.icon} text={item.text} onClick={item.onClick}
            divider={item.divider} ViewReset={triggerViewReset} closeEvent={closeEvent}
          />
          ))}
      </div>
    </div>
  );
};

export default ContextMenuFrameComponent;