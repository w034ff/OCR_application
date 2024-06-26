import CursorIcon from '../assets/svgs/CursorIcon';
import TrimIcon from '../assets/svgs/TrimIcon';
import MinusIcon from '../assets/svgs/MinusIcon';
import PlusIcon from '../assets/svgs/PlusIcon';


export const startGuideItems = [
  {
    icon: <CursorIcon className="icon" />,
    text: 'start-選択',
    title: '選択',
    className: 'guide-item start',
  },
  {
    icon: <TrimIcon className="icon bold" />,
    text: 'start-トリミング',
    title: 'トリミング',
    className: 'guide-item start',
  },
];


export const endGuideItems = [
  {
    icon: <MinusIcon className="icon" />,
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
    icon: <PlusIcon className="icon" />,
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
