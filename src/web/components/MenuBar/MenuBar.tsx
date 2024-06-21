import '../../styles/Menubar.css';
import { startItems, middleItems, endItems } from './menuItems';
import MenuGroup from './MenuGroup';
import { useMenuItemActions } from '../../hooks/useMenuItemActions';


const MenuBar = (): JSX.Element => { 
  const { 
    handleItemClick, fileInputRef, isActionDisabled, isAccordionOpen, setAccordionOpen
  } = useMenuItemActions();
  
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
