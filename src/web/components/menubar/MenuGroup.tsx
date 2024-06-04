import MenuItem from './MenuItem';

interface MenuGroupProps {
  justifyContent?: string;
  items: Array<{
    icon?: string;
    text: string;
  }>;
}

const MenuGroup: (props: MenuGroupProps) => JSX.Element = ({ justifyContent, items }) => {
  return (
    <div className="menu-group" style={{ justifyContent }}>
      {items.map((item, index) => (
        <MenuItem key={index} icon={item.icon} text={item.text} />
      ))}
    </div>
  );
}

export default MenuGroup
