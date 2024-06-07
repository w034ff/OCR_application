import {
  SideBar,
  GuideBar,
  CanvasContextMenu,
  CanvasModalWindow
} from './components';
import CanvasComponent from './canvas'
import { CanvasModalWindowProvider } from './components/modalWindow/CanvasModalWindowContext';
import { ContextMenuProvider } from './components/canvasContextMenu/ContextMenuContext';
import { useMenuItemFlipEffects } from './hooks/useMenuItemFlipEffects';

const CanvasInterface = (): JSX.Element => {
  const { topSectionStyle, sideBarStyle } = useMenuItemFlipEffects();

  // console.log('render CanvasInterface');

  return (
    <>
      <CanvasModalWindowProvider>
        <GuideBar />
        <div className="top-section" style={topSectionStyle}>
          <ContextMenuProvider>
            <CanvasComponent />
            <CanvasContextMenu />
            <div className="sidebar" style={sideBarStyle}>
              <SideBar />
            </div>
          </ContextMenuProvider>
        </div>  
        <CanvasModalWindow />
      </CanvasModalWindowProvider>
    </>
  );
};

export default CanvasInterface
