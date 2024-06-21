import { createContext, useContext, ReactNode, useState } from 'react';


interface SidebarStateContextProps {
  trimModeActive: boolean;
  setTrimModeActive: React.Dispatch<React.SetStateAction<boolean>>;
  resizeModeActive: boolean;
  setResizeModeActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarStateContext = createContext<SidebarStateContextProps | undefined>(undefined);

interface SidebarStateProviderProps {
  children: ReactNode;
}

export const SidebarStateProvider = ({ children }: SidebarStateProviderProps): JSX.Element => {
  const [trimModeActive, setTrimModeActive] = useState<boolean>(false);
  const [resizeModeActive, setResizeModeActive] = useState<boolean>(false);

  return (
    <SidebarStateContext.Provider value = {{ 
      trimModeActive, setTrimModeActive, resizeModeActive, setResizeModeActive
    }}>
      {children}
    </SidebarStateContext.Provider>
  );
}

export const useSidebarStateContext = (): SidebarStateContextProps => {
  const StateContext = useContext(SidebarStateContext);
  if (!StateContext) {
    throw new Error('SidebarStateContext must be used within a SidebarStateProvider');
  }
  return StateContext;
}
