import UnRedoIcon from '../assets/svgs/UnRedoIcon';
import InsertIcon from '../assets/svgs/InsertIcon';
import ViewResetIcon from '../assets/svgs/ViewResetIcon';

export const ContextMenuItems = [
  {
    icon: <UnRedoIcon className="icon" style={{ width: "20px", height: "20px" }} />,
    text: '元に戻す',
  },
  {
    icon: <UnRedoIcon className="icon" style={{ width: "20px", height: "20px", transform: "scaleX(-1) translateX(-5px)" }} />,
    text: 'やり直し',
  },
  {
    divider: true
  },
  {
    icon: <InsertIcon className="icon" style={{ width: "20px", height: "20px" }} />,
    text: '挿入',
  },
  {
    icon: <ViewResetIcon className="icon" style={{ width: "20px", height: "20px" }} />,
    text: 'ビューをリセットします'
  },
];