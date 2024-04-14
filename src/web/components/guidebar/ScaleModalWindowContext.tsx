import React, { createContext, useContext, ReactNode, useState, JSX } from 'react';


interface ScaleModalWindowContextProps {
  scaleModalMode: string;
  setScaleModalMode: React.Dispatch<React.SetStateAction<string>>;
}

const ScaleModalWindowContext = createContext<ScaleModalWindowContextProps | undefined>(undefined);

interface ScaleModalWindowProviderProps {
  children: ReactNode;
}

export const ScaleModalWindowProvider = ({ children }: ScaleModalWindowProviderProps): JSX.Element => {
  const [scaleModalMode, setScaleModalMode] = useState<string>("");

  return (
      <ScaleModalWindowContext.Provider value = {{ scaleModalMode, setScaleModalMode }}>
        {children}
      </ScaleModalWindowContext.Provider>
  );
}

export const useScaleModalWindowContext = (): ScaleModalWindowContextProps => {
  const ScaleModalContext = useContext(ScaleModalWindowContext);
  if (!ScaleModalContext) {
    throw new Error('ScaleModalWindowContext must be used within a ScaleModalWindowProvider');
  }
  return ScaleModalContext;
}
