import React, { JSX } from 'react';
import MenuItem from './MenuItem';

interface MenuGroupProps {
  justifyContent?: string;
  items: Array<{
    icon?: string;
    text: string;
    onClick?: (e: React.MouseEvent) => void;
  }>;
}

const MenuGroup: (props: MenuGroupProps) => JSX.Element = ({ justifyContent, items }) => {
  return (
    <div className="menu-group" style={{ justifyContent }}>
      {items.map((item, index) => (
        <MenuItem key={index} icon={item.icon} text={item.text} onClick={item.onClick} />
      ))}
    </div>
  );
}

export default MenuGroup
