import { createContext, useContext, ReactNode, useState } from 'react';

interface HistoryContextProps {
  isSaveState: boolean;
  setIsSaveState: React.Dispatch<React.SetStateAction<boolean>>;
  historyValue: number;
  setHistoryValue: React.Dispatch<React.SetStateAction<number>>;
  maxHistory: number;
  setMaxHistory: React.Dispatch<React.SetStateAction<number>>;
  lastHistoryValue: number;
  setLastHistoryValue: React.Dispatch<React.SetStateAction<number>>;
}

const HistoryContext = createContext<HistoryContextProps | undefined>(undefined);

interface CanvasHistoryProviderProps {
  children: ReactNode;
}

export const CanvasHistoryProvider = ({ children }: CanvasHistoryProviderProps): JSX.Element => {
  const [isSaveState, setIsSaveState] = useState<boolean>(false);
  const [historyValue, setHistoryValue] = useState<number>(0);
  const [maxHistory, setMaxHistory] = useState<number>(0);
  const [lastHistoryValue, setLastHistoryValue] = useState<number>(0);

  return (
    <HistoryContext.Provider value={{
      isSaveState, setIsSaveState, historyValue, setHistoryValue, 
      maxHistory, setMaxHistory, lastHistoryValue, setLastHistoryValue
    }}>
      {children}
    </HistoryContext.Provider>
  );
}

export const useHistoryContext = (): HistoryContextProps => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistoryContext must be used within a CanvasHistoryProvider');
  }
  return context;
}
