import '../../styles/Guidebar.css';
import { startGuideItems, endGuideItems } from './guideItems';
import GuideGroup from './GuideGroup';
import { useMenuItemFlipEffects } from '../../hooks/useMenuItemFlipEffects';

const GuideBar = (): JSX.Element | null => {  
  const { guideBarStyle } = useMenuItemFlipEffects();

  // console.log("render GuideBar")

  return (
    <div className="guidebar" style={guideBarStyle}>
      <GuideGroup justifyContent='flex-start' items={startGuideItems} />
      <GuideGroup justifyContent='flex-end' items={endGuideItems}  className="end-guide-group" />
    </div>
  );
};

export default GuideBar;
