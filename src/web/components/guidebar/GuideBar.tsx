import '../../styles/Guidebar.css';
import { startGuideItems, endGuideItems } from './guideItems';
import GuideGroup from './GuideGroup';
import { useCanvasFlipContext } from '../../CanvasToolsContext';

const GuideBar = (): JSX.Element | null => {  
  const { isFlipped } = useCanvasFlipContext();

  const guideBarStyle = {
    display: isFlipped ? 'none' : 'flex',
    height: isFlipped ? '0px' : '48px',
  };

  // console.log("render GuideBar")

  return (
    <div className="guidebar" style={guideBarStyle}>
      <GuideGroup justifyContent='flex-start' items={startGuideItems} />
      <GuideGroup justifyContent='flex-end' items={endGuideItems}  className="end-guide-group" />
    </div>
  );
};

export default GuideBar;
