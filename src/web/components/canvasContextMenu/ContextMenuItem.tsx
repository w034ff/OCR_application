import { memo } from 'react'
import clsx from 'clsx';
import FileInput from '../FileInput/FileInput';

interface ContextMenuItemProps {
  icon?: JSX.Element;
  text: string;
  divider?: boolean;
  className: string;
  isActionDisabled: boolean;
  fileInputRef?: React.RefObject<HTMLInputElement>;
  clickEvent?: () => void;
}

const ContextMenuItem: (props: ContextMenuItemProps) => JSX.Element = ({
  icon, text, divider, className, isActionDisabled, fileInputRef, clickEvent
}) => {

  // console.log("render ContextMenuItem");

  if (divider) {
    return <div className={className} />;
  }

  return (
    <div className={clsx(className, { disabled: isActionDisabled })}  onClick={clickEvent}>
      {icon}
      {<div className="text">{text}</div>}
      {text === '挿入' && fileInputRef && <FileInput fileInputRef={fileInputRef} />}
    </div>
  );
};

export default memo(ContextMenuItem);
