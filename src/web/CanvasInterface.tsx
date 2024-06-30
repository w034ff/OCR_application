import {
  SideBar,
  GuideBar,
  CanvasContextMenu,
  ModalWindow
} from './components';
import CanvasContainer from './canvas'
import { ContextMenuProvider } from './components/ContextMenu/ContextMenuContext';
import { ResizeCanvasProvider } from './components/ModalWindow/ResizeCanvasContext';
import { useMenuItemFlipEffects } from './hooks/useMenuItemFlipEffects';

const CanvasInterface = (): JSX.Element => {
  const { topSectionStyle, sideBarStyle } = useMenuItemFlipEffects();

  // console.log('render CanvasInterface');

  return (
    <>
      <GuideBar />
      <ResizeCanvasProvider>
        <div className="top-section" style={topSectionStyle}>
          <ContextMenuProvider>
            <CanvasContainer />
            <CanvasContextMenu />
            <div className="sidebar" style={sideBarStyle}>
              <SideBar />
            </div>
          </ContextMenuProvider>
        </div>  
        <ModalWindow />
      </ResizeCanvasProvider>
    </>
  );
};

export default CanvasInterface
