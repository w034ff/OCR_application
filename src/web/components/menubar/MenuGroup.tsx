import React, { memo, useMemo } from 'react';
import MenuItem from './MenuItem';
import Accordion  from './Accordion';
import FileInput from '../FileInput/FileInput';

interface MenuGroupProps {
  justifyContent?: string;
  items: Array<{
    icon?: JSX.Element;
    text: string;
    className: string;
  }>;
  handleItemClick: (text: string) => void;
  isActionDisabled?: (action?: string) => boolean;
  fileInputRef?: React.RefObject<HTMLInputElement>;
  isAccordionOpen?: boolean;
  setAccordionOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const MenuGroup: (props: MenuGroupProps) => JSX.Element = ({ 
  justifyContent, items, handleItemClick, isActionDisabled = () => false,
  fileInputRef, isAccordionOpen, setAccordionOpen 
}) => {
  // menubarItemsのメモ化を行う、特にクリックイベントはメモ化しにくいので注意が必要
  const menubarItems = useMemo(() => {
    return items.map((item) => ({
      ...item,
      // handleItemClickイベントをラップし、メニューバー用のクリックイベントを各要素に対して作成する
      clickEvent: () => {
        handleItemClick(item.text);
      }
    }));
  }, []);

  return (
    <div className="menu-group" style={{ justifyContent }}>
      {menubarItems.map((item, index) => (
        <React.Fragment key={index}>
          <MenuItem
            icon={item.icon}
            text={item.text}
            className={item.className}
            isActionDisabled={isActionDisabled(item.text)}
            clickEvent={isActionDisabled(item.text) ? undefined : item.clickEvent}
          />
          {item.text === '履歴' && isAccordionOpen !== undefined && setAccordionOpen && (
            <Accordion
              isAccordionOpen={isAccordionOpen}
              setAccordionOpen={setAccordionOpen}
            />
          )}
          {item.text === '挿入' && fileInputRef && <FileInput fileInputRef={fileInputRef} />}
        </React.Fragment>
      ))}
    </div>
  );
}

export default memo(MenuGroup);
