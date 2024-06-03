import cursorIcon from '../assets/icons/cursor.png';
import trimIcon from '../assets/icons/trim.png';
import plus from '../assets/icons/plus.png'
import minus from '../assets/icons/minus.png'


export const startGuideItems = [
  {
    icon: cursorIcon, 
    text: 'start-選択',
  },
  {
    icon: trimIcon, 
    text: 'start-トリミング',
  },
];


export const endGuideItems = [
  {
    icon: minus,
    text: 'handle-scale-minus',
  },
  {
    text: 'slider',
  },
  {
    icon: plus,
    text: 'handle-scale-plus',
  },
  {
    text: 'scale',
  },
];
