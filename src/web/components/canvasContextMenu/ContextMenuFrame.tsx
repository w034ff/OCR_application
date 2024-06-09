import '../../styles/ContextMenu.css'; 
import { useRef } from 'react';
import { useMenuItemDisabled } from '../../utils/useMenuItemDisabled';
import { useHistoryContext } from '../../CanvasHistoryContext';
import { useCanvasScaleControls } from '../../hooks/useCanvasScaleControls';
import { ContextMenuItems } from './ContextMenuItems';
import ContextMenuItem from './ContextMenuItem';
import { useControlContextMenu } from '../../hooks/useControlContextMenu';


const CanvasContextMenuFrame = (): JSX.Element  => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setUndoRedoState } = useHistoryContext();
  const isActionDisabled = useMenuItemDisabled();
  const { triggerViewReset } = useCanvasScaleControls();
  const { isVisible, contextMenuStyle, closeContextMenu } = useControlContextMenu();

  console.log("render ContextMenuFrame", isVisible);

  const handleItemClick = (text: string) => {
    return () => {
      if (isActionDisabled(text)) return;
      switch (text) {
        case '元に戻す':
          setUndoRedoState(prevState => ({ ...prevState, isUndo: !prevState.isUndo, count: 1 }));
          break;
        case 'やり直し':
          setUndoRedoState(prevState => ({ ...prevState, isRedo: !prevState.isRedo, count: 1 }));
          break;
        case '挿入':
          fileInputRef.current?.click();
          break;
        case 'ビューをリセットします':
          triggerViewReset();
          break;
        default:
          break;
      }
      closeContextMenu();
    };
  };

  return (
    <div>
      {isVisible && <div className="modal-background" />}
      <div className="contextMenu" style={contextMenuStyle}>
        {ContextMenuItems.map((item, index) => (
          <ContextMenuItem key={index} icon={item.icon} text={item.text} divider={item.divider}
            className={item.className} isActionDisabled={isActionDisabled(item.text)}
            fileInputRef={fileInputRef} clickEvent={handleItemClick(item.text)}
          />
          ))}
      </div>
    </div>
  );
};

export default CanvasContextMenuFrame;
