import '../../styles/Sidebar.css';
import { useSidebarStateContext } from './SidebarStateContext';
import TransformCanvasForm from './TransformCanvasForm';
import AddFabricObjectsForm from './AddFabricObjectsForm';

const SideBar = (): JSX.Element => {
  const { trimModeActive, setTrimModeActive, resizeModeActive, isAddFabricObjects } = useSidebarStateContext();

  if (trimModeActive || resizeModeActive) {
    return (
      <TransformCanvasForm
        trimModeActive={trimModeActive}
        setTrimModeActive={setTrimModeActive}
        resizeModeActive={resizeModeActive}
      />
    );
  } 
  else {
    return (
      <AddFabricObjectsForm />
    );
  }
}

export default SideBar
