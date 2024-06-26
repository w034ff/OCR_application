import UnRedoIcon from '../assets/svgs/UnRedoIcon';
import InsertIcon from '../assets/svgs/InsertIcon';
import ViewResetIcon from '../assets/svgs/ViewResetIcon';

export const ContextMenuItems = [
  {
    icon: <UnRedoIcon className="icon" />,
    text: '元に戻す',
    className: 'contextMenu-item',
  },
  {
    icon: <UnRedoIcon className="icon" style={{ transform: "scaleX(-1) translateX(-5px)" }} />,
    text: 'やり直し',
    className: 'contextMenu-item',
  },
  {
    divider: true,
    text: 'divider',
    className: 'contextMenu-item-divider',
  },
  {
    icon: <InsertIcon className="icon" />,
    text: '挿入',
    className: 'contextMenu-item',
  },
  {
    icon: <ViewResetIcon className="icon" />,
    text: 'ビューをリセットします',
    className: 'contextMenu-item',
  },
];
