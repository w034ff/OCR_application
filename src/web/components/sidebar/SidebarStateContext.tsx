import React, { createContext, useContext, ReactNode, useState, JSX } from 'react';


interface SidebarStateContextProps {
  trimDetailsVisible: boolean;
  setTrimDetailsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarStateContext = createContext<SidebarStateContextProps | undefined>(undefined);

interface SidebarStateProviderProps {
  children: ReactNode;
}

export const SidebarStateProvider = ({ children }: SidebarStateProviderProps): JSX.Element => {
  const [trimDetailsVisible, setTrimDetailsVisible] = useState<boolean>(false);

  return (
    <SidebarStateContext.Provider value = {{ trimDetailsVisible, setTrimDetailsVisible }}>
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
