import '../../styles/Sidebar.css';
// import { useSidebarStateContext } from './SidebarStateContext';
import TransformCanvasForm from './TransformCanvasForm';


const SideBar = (): JSX.Element => {
  // const { trimModeActive } = useSidebarStateContext();

  // if (trimModeActive) {
    return (
      <TransformCanvasForm />
    );
  // } 
  // else {
  //   return (
  //     <ResizeCanvasForm />
  //   );
  // }
}

export default SideBar
