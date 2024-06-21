import { memo } from 'react';
import clsx from 'clsx';

interface MenuItemProps {
  icon?: JSX.Element;
  text: string;
  className: string;
  isActionDisabled: boolean;
  clickEvent?: () => void;
}

const MenuItem: (props: MenuItemProps) => JSX.Element = ({
  icon, text, className, isActionDisabled, clickEvent
}) => {
  // console.log("render MenuItem");

  return (
    <div className={clsx(className, { disabled: isActionDisabled })} onClick={clickEvent}>
      {icon}
      {text !== '閉じる'  && <div className="text">{text}</div>}
    </div>
  );
}

export default memo(MenuItem);
