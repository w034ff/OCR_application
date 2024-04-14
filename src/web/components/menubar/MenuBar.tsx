import React, { JSX } from 'react';
import './Menubar.css';
import { startItems } from './startItems';
import { middleItems } from './middleItems';
import { endItems } from './endItems';
import MenuGroup from './MenuGroup';


const MenuBar = (): JSX.Element => {  
  
  return (
          <div id="react-menu-bar"> 
              <div className="menu-bar">
                  <MenuGroup justifyContent='flex-start' items={startItems} />
                  <MenuGroup items={middleItems} />
                  <MenuGroup justifyContent='flex-end' items={endItems} />
              </div>
          </div>
  );
};

export default MenuBar