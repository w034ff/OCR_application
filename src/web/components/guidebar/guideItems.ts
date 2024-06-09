import cursorIcon from '../assets/icons/cursor.png';
import trimIcon from '../assets/icons/trim.png';
import plus from '../assets/icons/plus.png'
import minus from '../assets/icons/minus.png'


export const startGuideItems = [
  {
    icon: cursorIcon, 
    text: 'start-選択',
    title: '選択',
    className: 'guide-item start',
  },
  {
    icon: trimIcon, 
    text: 'start-トリミング',
    title: 'トリミング',
    className: 'guide-item start',
  },
];


export const endGuideItems = [
  {
    icon: minus,
    text: 'handle-scale-minus',
    title: '縮小',
    className: 'guide-item plus-minus-scale',
  },
  {
    text: 'slider',
    title: 'ズームを調整します',
    className: 'guide-item slider',
  },
  {
    icon: plus,
    text: 'handle-scale-plus',
    title: '拡大',
    className: 'guide-item plus-minus-scale',
  },
  {
    text: 'scale',
    title: 'ズームを調整します',
    className: 'guide-item display-scale',
  },
];
