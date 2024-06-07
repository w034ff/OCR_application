import { useRef } from 'react';
import FileInput from '../FileInput/FileInput';
import { useMenuItemDisabled } from '../../utils/useMenuItemDisabled';
import { useControlContextMenu } from '../../useControlContextMenu';
import { useHistoryContext } from '../../CanvasHistoryContext';
import { useCanvasScaleControls } from '../../hooks/ScaleUpdate';

interface ContextMenuItemProps {
  icon?: JSX.Element;
  text: string;
  divider?: boolean;
  ViewReset: () => void;
}

const ContextMenuItem: (props: ContextMenuItemProps) => JSX.Element = ({ icon, text, divider, ViewReset}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setUndoRedoState } = useHistoryContext();
  const { closeContextMenu } = useControlContextMenu();
  const isActionDisabled = useMenuItemDisabled();
  const { triggerViewReset } = useCanvasScaleControls();

  // console.log("render ContextMenuItem")


  const handleItemClick = () => {
    if (isActionDisabled(text)) return;
    if (text === '元に戻す') {
      setUndoRedoState(prevState => ({...prevState, isUndo: !prevState.isUndo, count: 1}));
    } else if (text === 'やり直し') {
      setUndoRedoState(prevState => ({...prevState, isRedo: !prevState.isRedo, count: 1}));
    } else if (text === '挿入') {
      fileInputRef.current?.click();
    } else if (text === 'ビューをリセットします') {
      triggerViewReset();
    }
    closeContextMenu();
  };

  if (divider) {
    return <div className="contextMenu-item-divider" />;
  }

  const menuItemClasses = `contextMenu-item ${isActionDisabled(text) ? 'disabled' : ''}`;

  return (
    <div className={menuItemClasses} onClick={handleItemClick}>
      {icon}
      {text && <div className="text">{text}</div>}
      {text === '挿入' && <FileInput fileInputRef={fileInputRef} />}
    </div>
  );
};

export default ContextMenuItem;
