import { useMemo } from 'react';
import '../../styles/ContextMenu.css'; 
import { ContextMenuItems } from './ContextMenuItems';
import ContextMenuItem from './ContextMenuItem';
import { useControlContextMenu } from '../../hooks/useControlContextMenu';
import { useMenuItemActions } from '../../hooks/useMenuItemActions';
import { useHistoryContext } from '../../CanvasHistoryContext';

const CanvasContextMenuFrame = (): JSX.Element  => {
  const { isVisible, contextMenuStyle, closeContextMenu } = useControlContextMenu();
  const { handleItemClick, fileInputRef } = useMenuItemActions();
  const { isActionDisabled } = useHistoryContext();

  // console.log("render ContextMenuFrame", isVisible);
  // contextMenuItemsのメモ化を行う、特にクリックイベントはメモ化しにくいので注意が必要
  const contextMenuItems = useMemo(() => {
    return ContextMenuItems.map((item) => ({
      ...item,
      // handleItemClickイベントをラップし、コンテキストメニュー用のクリックイベントを各要素に対して作成する
      clickEvent: () => {
        handleItemClick(item.text);
        closeContextMenu();
      }
    }));
  }, []);

  return (
    <div>
      {isVisible && <div className="modal-background" />}
      <div className="contextMenu" style={contextMenuStyle}>
      {contextMenuItems.map((item, index) => (
        <ContextMenuItem
          key={index}
          icon={item.icon}
          text={item.text}
          divider={item.divider}
          className={item.className}
          isActionDisabled={isActionDisabled(item.text)}
          fileInputRef={fileInputRef}
          clickEvent={isActionDisabled(item.text) || item.divider ? undefined : item.clickEvent}
        />
      ))}
      </div>
    </div>
  );
};

export default CanvasContextMenuFrame;
