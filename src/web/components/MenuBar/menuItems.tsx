
import MenuIcon from '../assets/svgs/MenuIcon';
import CanvasIcon from '../assets/svgs/CanvasIcon';
import UnRedoIcon from '../assets/svgs/UnRedoIcon';
import InsertIcon from '../assets/svgs/InsertIcon';
import HistoryIcon from '../assets/svgs/HistoryIcon';
import SortIcon from '../assets/svgs/SortIcon';
import SettingIcon from '../assets/svgs/SettingIcon';
import PasteIcon from '../assets/svgs/PasteIcon';


export const startItems = [
  {
    icon: <MenuIcon className="icon" />,
    text: 'メニュー',
    className: 'menu-item',
  },
];


export const middleItems = [
  {
    icon: <SettingIcon className="icon" />,
    text: '図形を追加',
    className: 'menu-item',
  },
  {
    icon: <SettingIcon className="icon" />,
    text: '設定',
    className: 'menu-item',
  },
  {
    icon: <PasteIcon className="icon" />,
    text: '貼り付け',
    className: 'menu-item',
  },
  {
    icon: <CanvasIcon className="icon" />,
    text: 'キャンバス',
    className: 'menu-item',
  },
];


export const endItems = [
  {
    icon: <InsertIcon className="icon bold" />,
    text: '挿入',
    className: 'menu-item',
  },
  {
    icon: <UnRedoIcon className="icon bold" />,
    text: '元に戻す',
    className: 'menu-item',
  },
  {
    icon: <HistoryIcon className="icon" />,
    text: '履歴',
    className: 'menu-item',
  },
  {
    icon: <UnRedoIcon className="icon bold" style={{ transform: "scaleX(-1)" }} />,
    text: 'やり直し',
    className: 'menu-item',
  },
  {
    icon: <SortIcon className="flip-icon bold" />,
    text: '閉じる',
    className: 'menu-item close',
  },
];
