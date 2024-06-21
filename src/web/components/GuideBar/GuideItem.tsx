import { memo } from 'react';
import SliderContainer from '../Slider/SliderContainer';

interface GuideItemProps {
  icon?: JSX.Element;
  text: string;
  title: string;
  className: string;
  displayScale?: string;
  clickEvent?: () => void;
}

const GuideItem: (props: GuideItemProps) => JSX.Element = ({
  icon, text, title, className, displayScale, clickEvent
}) => {
  // console.log("render GuideItem");
  return (
    <div className={className} title={title} onClick={clickEvent}>
      {icon}
      {text.includes('start') && 
        <div className="start-text">{text.replace('start-', '')}</div>
      }
      {text === 'scale' && (
        <div className="scale-text">
          <span className="scale-value">{displayScale}</span><span>%</span>
        </div>
      )}
      {text === 'slider' && (
        <SliderContainer type={'guidebar'} />
      )}
    </div>
  );
}

export default memo(GuideItem);
