import GuideItem from './GuideItem';

interface GuideGroupProps {
  justifyContent?: string;
  className?: string;
  items: Array<{
    icon?: string;
    text: string;
    title: string;
    className: string;
  }>;
}

const GuideGroup: (props: GuideGroupProps) => JSX.Element = ({ justifyContent, className, items }) => {
  const guideGroupClass = `guide-group ${className || ''}`;

  return (
    <div className={guideGroupClass} style={{ justifyContent }}>
      {items.map((item, index) => (
        <GuideItem key={index} icon={item.icon} text={item.text} title={item.title} className={item.className} />
      ))}
    </div>
  );
}

export default GuideGroup;
