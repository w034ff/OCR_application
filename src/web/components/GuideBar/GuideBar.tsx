import '../../styles/Guidebar.css';
import { startGuideItems, endGuideItems } from './guideItems';
import GuideGroup from './GuideGroup';
import { useMenuItemFlipEffects } from '../../hooks/useMenuItemFlipEffects';
import { useMenuItemActions } from '../../hooks/useMenuItemActions';
import { useCanvasScaleControls } from '../../hooks/useCanvasScaleControls';

const GuideBar = (): JSX.Element | null => {  
  const { guideBarStyle } = useMenuItemFlipEffects();
  const { handleItemClick } = useMenuItemActions();
  const { zoomScalingDisabled, displayScale } = useCanvasScaleControls();
  
  return (
    <div className="guidebar" style={guideBarStyle}>
      <GuideGroup 
        justifyContent='flex-start' 
        items={startGuideItems} 
        handleItemClick={handleItemClick}
      />
      <GuideGroup 
        justifyContent='flex-end'
        items={endGuideItems}
        className="end-guide-group"
        handleItemClick={handleItemClick}
        zoomScalingDisabled={zoomScalingDisabled}
        displayScale={displayScale}
      />
    </div>
  );
};

export default GuideBar;
