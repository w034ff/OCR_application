import GuideItem from './GuideItem';

interface GuideGroupProps {
  justifyContent?: string;
  className?: string;
  items: Array<{
    icon?: string;
    svg?: JSX.Element;
    text: string;
    onClick?: (e: React.MouseEvent) => void;
  }>;
}

const GuideGroup: (props: GuideGroupProps) => JSX.Element = ({ justifyContent, className, items }) => {
  const guideGroupClass = `guide-group ${className || ''}`;

  return (
    <div className={guideGroupClass} style={{ justifyContent }}>
      {items.map((item, index) => (
        <GuideItem key={index} icon={item.icon} svg={item.svg} text={item.text} onClick={item.onClick} />
      ))}
    </div>
  );
}

export default GuideGroup;
