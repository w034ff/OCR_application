import { memo } from 'react';
import clsx from 'clsx';
import FileInput from '../FileInput/FileInput';

interface MenuItemProps {
  icon?: JSX.Element;
  text: string;
  className: string;
  fileInputRef?: React.RefObject<HTMLInputElement>;
  isActionDisabled: boolean;
  clickEvent?: () => void;
}

const MenuItem: (props: MenuItemProps) => JSX.Element = ({
  icon, text, className, fileInputRef, isActionDisabled, clickEvent
}) => {
  // console.log("render MenuItem");

  return (
    <div className={clsx(className, { disabled: isActionDisabled })} onClick={clickEvent}>
      {icon}
      {text !== '閉じる'  && <div className="text">{text}</div>}
      {text === '挿入' && fileInputRef && <FileInput fileInputRef={fileInputRef} />}
    </div>
  );
}

export default memo(MenuItem);
