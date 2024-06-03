import { useRef } from 'react';
import FileInput from '../FileInput/FileInput';
import { useHistoryContext } from '../../CanvasHistoryContext';

interface ContextMenuItemProps {
  icon?: JSX.Element;
  text?: string;
  onClick?: (e: React.MouseEvent) => void;
  divider?: boolean;
  ViewReset: () => void;
  closeEvent: () => void;
}

const ContextMenuItem: (props: ContextMenuItemProps) => JSX.Element = ({ icon, text, onClick, divider, ViewReset, closeEvent}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { historyValue, maxHistory } = useHistoryContext();

  const isActionDisabled = (action?: string) : boolean => {
    return (action === 'やり直し' && historyValue === maxHistory) ||
           (action === '元に戻す' && historyValue === 0);
  };

  const handleItemClick = (e: React.MouseEvent) => {
    if (isActionDisabled(text)) return;
    if (text === 'ビューをリセットします') {
      ViewReset();
    } else if (text === '挿入') {
      fileInputRef.current?.click();
    } else if (onClick) {
      onClick(e);
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
