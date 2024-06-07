import { createContext, useContext, ReactNode, useState } from 'react';

interface SaveStateContextProps {
  isSaveState: boolean;
  setIsSaveState: React.Dispatch<React.SetStateAction<boolean>>;
}

const SaveStateContext = createContext<SaveStateContextProps | undefined>(undefined);

interface CanvasSaveStateProviderProps {
  children: ReactNode;
}

export const CanvasSaveStateProvider = ({ children }: CanvasSaveStateProviderProps): JSX.Element => {
  const [isSaveState, setIsSaveState] = useState<boolean>(false);

  return (
    <SaveStateContext.Provider value={{ isSaveState, setIsSaveState }}>
      {children}
    </SaveStateContext.Provider>
  );
}

export const useSaveStateContext = (): SaveStateContextProps => {
  const context = useContext(SaveStateContext);
  if (!context) {
    throw new Error('useSaveStateContext must be used within a CanvasSaveStateProvider');
  }
  return context;
}
