import '../../styles/Menubar.css';
import { startItems, middleItems, endItems } from './menuItems';
import MenuGroup from './MenuGroup';
import { useMenuItemActions } from '../../hooks/useMenuItemActions';
import { useHistoryContext } from '../../CanvasHistoryContext';

const MenuBar = (): JSX.Element => {
  const { handleItemClick, fileInputRef, isAccordionOpen, setAccordionOpen } = useMenuItemActions();
  const { isActionDisabled } = useHistoryContext();
  
  return (
    <div id="react-menu-bar"> 
      <div className="menu-bar">
        <MenuGroup 
          justifyContent='flex-start'
          items={startItems}
          handleItemClick={handleItemClick}
        />
        <MenuGroup 
          items={middleItems}
          handleItemClick={handleItemClick}
        />
        <MenuGroup 
          justifyContent='flex-end'
          items={endItems} 
          isActionDisabled={isActionDisabled}
          fileInputRef={fileInputRef}
          handleItemClick={handleItemClick}
          isAccordionOpen={isAccordionOpen}
          setAccordionOpen={setAccordionOpen}
        />
      </div>
    </div>
  );
};

export default MenuBar;
