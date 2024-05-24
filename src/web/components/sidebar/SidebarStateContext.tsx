import React, { createContext, useContext, ReactNode, useState, JSX } from 'react';


interface SidebarStateContextProps {
  trimModeActive: boolean;
  setTrimModeActive: React.Dispatch<React.SetStateAction<boolean>>;
  resizeModeActive: boolean;
  setResizeModeActive: React.Dispatch<React.SetStateAction<boolean>>;
  isResizeAspectRatioLocked: boolean;
  setIsResizeAspectRatioLocked: React.Dispatch<React.SetStateAction<boolean>>;
  resizeRatio: number;
  setResizeRatio: React.Dispatch<React.SetStateAction<number>>;
}

const SidebarStateContext = createContext<SidebarStateContextProps | undefined>(undefined);

interface SidebarStateProviderProps {
  children: ReactNode;
}

export const SidebarStateProvider = ({ children }: SidebarStateProviderProps): JSX.Element => {
  const [trimModeActive, setTrimModeActive] = useState<boolean>(false);
  const [resizeModeActive, setResizeModeActive] = useState<boolean>(false);
  const [isResizeAspectRatioLocked, setIsResizeAspectRatioLocked] = useState<boolean>(false);
  const [resizeRatio, setResizeRatio] = useState<number>(1);

  return (
    <SidebarStateContext.Provider value = {{ 
      trimModeActive, setTrimModeActive, resizeModeActive, setResizeModeActive,
      isResizeAspectRatioLocked, setIsResizeAspectRatioLocked, resizeRatio, setResizeRatio
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
