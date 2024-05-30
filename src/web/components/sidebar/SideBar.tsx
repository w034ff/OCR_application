import '../../styles/Sidebar.css';
import { useSidebarStateContext } from './SidebarStateContext';
import ResizeCanvasForm from './ChangeCanvasSize';


const SideBar = (): JSX.Element | undefined => {
  const { trimModeActive } = useSidebarStateContext();

  // if (trimModeActive) {
    return (
      <ResizeCanvasForm />
    );
  // } 
  // else {
  //   return (
  //     <ResizeCanvasForm />
  //   );
  // }
}

export default SideBar
