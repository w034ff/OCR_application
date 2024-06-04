import { useState, useRef } from 'react';
import Accordion  from './Accordion'
import FileInput from '../FileInput/FileInput';
import SortIcon from '../assets/svgs/SortIcon';
import { useHistoryContext } from '../../CanvasHistoryContext'
import { useCanvasFlipContext } from '../../CanvasToolsContext';
import { useSidebarStateContext } from '../sidebar/SidebarStateContext';


interface MenuItemProps {
  icon?: string;
  text: string;
}

const MenuItem: (props: MenuItemProps) => JSX.Element = ({ icon, text }) => {
  const { isFlipped, setIsFlipped } = useCanvasFlipContext();
  const { setTrimModeActive, setResizeModeActive } = useSidebarStateContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAccordionOpen, setAccordionOpen] = useState(false);
  const { historyValue, maxHistory, setUndoRedoState } = useHistoryContext();
  const isRedoDisabled = historyValue === maxHistory;
  const isUndoDisabled = historyValue === 0;

  const menuItemClassNames = ['menu-item'];
  if (isRedoDisabled && text === 'やり直し' || isUndoDisabled && text === '元に戻す') menuItemClassNames.push('disabled');
  if (text === '閉じる') menuItemClassNames.push('close');

  const menuItemClasses = menuItemClassNames.join(' ');

  const handleItemClick = () => {
    setTrimModeActive(false);
    setResizeModeActive(false);
    if (text === 'キャンバス') {
      setResizeModeActive(true)
    } else if (text === '挿入') {
      fileInputRef.current?.click();
    } else if (text === '元に戻す') {
      setUndoRedoState(prevState => ({...prevState, isUndo: !prevState.isUndo, count: 1}));
    } else if (text === '履歴') {
      setAccordionOpen(!isAccordionOpen);
    } else if (text === 'やり直し') {
      setUndoRedoState(prevState => ({...prevState, isRedo: !prevState.isRedo, count: 1}));
    } else if (text === '閉じる') {
      setIsFlipped(!isFlipped);
    }
  };

  // console.log("render MenuItem")

  return (
    <>
      <div className={menuItemClasses} onClick={handleItemClick}>
        {text !== '閉じる' && (
          <>
            <img src={icon} alt={text} className="icon" width="20" height="20" />
            <div className="text">{text}</div>
          </>
        )}
        {text === '閉じる' && (
          <SortIcon
            className="flip-icon"
            style={{
              paddingTop: isFlipped ? "none" : "17px",
              paddingBottom: isFlipped ? "17px" : "none",
              transform: isFlipped ? 'scaleY(-1)' : 'none'
            }}
          />
        )}
        {text === '挿入' && <FileInput fileInputRef={fileInputRef} />}
      </div>
      {text === '履歴' && isAccordionOpen &&(
        <Accordion
          isAccordionOpen={isAccordionOpen}
          setAccordionOpen={setAccordionOpen}
        />
      )}
    </>
  );
}

export default MenuItem;
