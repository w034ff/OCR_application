import {
  SideBar,
  GuideBar,
} from './components';
import CanvasComponent from './canvas'
import { useCanvasFlipContext } from './CanvasToolsContext';
import CanvasModalWindow from './components/modalWindow/ScaleModalWindow';
import { CanvasModalWindowProvider } from './components/modalWindow/CanvasModalWindowContext';

const CanvasInterface = (): JSX.Element => {  
  const { isFlipped } = useCanvasFlipContext();

  const topSectionStyle = {
    height: isFlipped ? '100%' : 'calc(100% - 48px)',
  };

  const sidebarStyle = {
    boxShadow: isFlipped ? '-5px 0 5px rgba(0, 0, 0, 0.1)' : '-8px 0 3px -3px rgba(0, 0, 0, 0.1)',
  };

  return (
    <>
      <CanvasModalWindowProvider>
        <GuideBar />
        <div className="top-section" style={topSectionStyle}>
            <CanvasComponent />
            <div className="sidebar" style={sidebarStyle}>
              <SideBar />
            </div>
        </div>
        <CanvasModalWindow />
      </CanvasModalWindowProvider>
    </>
  );
};

export default CanvasInterface
