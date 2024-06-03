import menuIcon from '../assets/icons/menu.png';
import insert from '../assets/icons/insert.png'
import undo from '../assets/icons/undo.png'
import redo from '../assets/icons/redo.png'
import history from '../assets/icons/history_icon.png'
import { handleUndoRedoAction } from '../../hooks/UndoRedo';


export const startItems = [
  {
    icon: menuIcon, 
    text: 'メニュー',
    onClick: () => console.log('メニュークリック'),
  },
];


export const middleItems = [
  {
    icon: menuIcon,
    text: '図形を追加',
    onClick: () => console.log('Search clicked'),
  },
  {
    icon: menuIcon,
    text: '貼り付け',
    onClick: () => console.log('貼り付け clicked'),
  },
  {
    // icon: menuIcon,
    text: 'キャンバス',
  },
];


export const endItems = [
    {
      icon: insert,
      text: '挿入',
    },
    {
      icon: undo,
      text: '元に戻す',
      onClick: () => handleUndoRedoAction('Undo', 1),
    },
    {
      icon: history,
      text: '履歴',
    },
    {
      icon: redo,
      text: 'やり直し',
      onClick: () => handleUndoRedoAction('Redo', 1),
    },
    {
      text: '閉じる',
    },
  ];
