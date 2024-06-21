import { useMemo, memo } from 'react';
import clsx from 'clsx';
import GuideItem from './GuideItem';

interface GuideGroupProps {
  justifyContent?: string;
  items: Array<{
    icon?: JSX.Element;
    text: string;
    title: string;
    className: string;
  }>;
  className?: string;
  handleItemClick: (text: string) => void;
  zoomScalingDisabled?: (action: string) => boolean;
  displayScale?: string;
}

const GuideGroup: (props: GuideGroupProps) => JSX.Element = ({ 
  justifyContent, items, className, handleItemClick,
  zoomScalingDisabled = () => false, displayScale
}) => {
  // guidebarItemsのメモ化を行う、特にクリックイベントはメモ化しにくいので注意が必要
  const guitebarItems = useMemo(() => {
    return items.map((item) => ({
      ...item,
      // handleItemClickイベントをラップし、ガイドバー用のクリックイベントを各要素に対して作成する
      clickEvent: () => {
        handleItemClick(item.text);
      }
    }));
  }, []);

  return (
    <div className={clsx('guide-group', className)} style={{ justifyContent }}>
      {guitebarItems.map((item, index) => (
        <GuideItem 
          key={index}
          icon={item.icon}
          text={item.text}
          title={item.title}
          className={item.className}
          displayScale={item.text === 'scale' ? displayScale : undefined}
          clickEvent={zoomScalingDisabled(item.text) ? undefined : item.clickEvent}
        />
      ))}
    </div>
  );
}

export default memo(GuideGroup);
