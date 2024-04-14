import UnRedoIcon from '../assets/svgs/UnRedoIcon';
import InsertIcon from '../assets/svgs/InsertIcon';
import ViewResetIcon from '../assets/svgs/ViewResetIcon';
import { handleUndoRedoAction } from '../menubar/handlers';

export const ContextMenuItems = [
  {
    icon: <UnRedoIcon className="icon" style={{ width: "20px", height: "20px" }} />,
    text: '元に戻す',
    onClick: () => handleUndoRedoAction('Undo', 1),
  },
  {
    icon: <UnRedoIcon className="icon" style={{ width: "20px", height: "20px", transform: "scaleX(-1) translateX(-5px)" }} />,
    text: 'やり直し',
    onClick: () => handleUndoRedoAction('Redo', 1),
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