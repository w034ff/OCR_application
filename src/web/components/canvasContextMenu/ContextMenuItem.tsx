import { useRef } from 'react';
import FileInput from '../FileInput/FileInput';
import { useHistoryContext } from '../../CanvasHistoryContext';

interface ContextMenuItemProps {
  icon?: JSX.Element;
  text?: string;
  divider?: boolean;
  ViewReset: () => void;
  closeEvent: () => void;
}

const ContextMenuItem: (props: ContextMenuItemProps) => JSX.Element = ({ icon, text, divider, ViewReset, closeEvent}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { historyValue, maxHistory, setUndoRedoState } = useHistoryContext();

  const isActionDisabled = (action?: string) : boolean => {
    return (action === 'やり直し' && historyValue === maxHistory) ||
           (action === '元に戻す' && historyValue === 0);
  };

  const handleItemClick = () => {
    if (isActionDisabled(text)) return;
    if (text === '元に戻す') {
      setUndoRedoState(prevState => ({...prevState, isUndo: !prevState.isUndo, count: 1}));
    } else if (text === 'やり直し') {
      setUndoRedoState(prevState => ({...prevState, isRedo: !prevState.isRedo, count: 1}));
    } else if (text === '挿入') {
      fileInputRef.current?.click();
    } else if (text === 'ビューをリセットします') {
      ViewReset();
    }
    closeEvent();
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
