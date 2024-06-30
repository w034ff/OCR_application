import { createContext, useContext, ReactNode, useState, useCallback, useMemo } from 'react';

interface UndoRedoState {
  isUndo: boolean;
  isRedo: boolean;
  count: number;
}

interface HistoryContextProps {
  historyValue: number;
  setHistoryValue: React.Dispatch<React.SetStateAction<number>>;
  maxHistory: number;
  setMaxHistory: React.Dispatch<React.SetStateAction<number>>;
  undoStack: FabricCanvasState[];
  setUndoStack: React.Dispatch<React.SetStateAction<FabricCanvasState[]>>;
  redoStack: FabricCanvasState[];
  setRedoStack: React.Dispatch<React.SetStateAction<FabricCanvasState[]>>;
  undoRedoState: UndoRedoState
  isSaveState: boolean;
  isActionDisabled: (action?: string) => boolean;
}

interface SetHistoryStateContextProps {
  setUndoRedoState: React.Dispatch<React.SetStateAction<UndoRedoState>>;
  toggleSaveState: () => void;
}

const HistoryContext = createContext<HistoryContextProps | undefined>(undefined);
const SetHistoryStateContext = createContext<SetHistoryStateContextProps | undefined>(undefined);

interface CanvasHistoryProviderProps {
  children: ReactNode;
}

export const CanvasHistoryProvider = ({ children }: CanvasHistoryProviderProps): JSX.Element => {
  const [historyValue, setHistoryValue] = useState<number>(0);
  const [maxHistory, setMaxHistory] = useState<number>(0);
  const [undoStack, setUndoStack] = useState<FabricCanvasState[]>([]);
  const [redoStack, setRedoStack] = useState<FabricCanvasState[]>([]);
  const [undoRedoState, setUndoRedoState] = useState<UndoRedoState>({ isUndo: false, isRedo: false, count: 1});
  const [isSaveState, setIsSaveState] = useState<boolean>(false);

  // Undo, Redoの処理を条件によって無効化する関数
  const isActionDisabled = useCallback((action?: string) : boolean => {
    return (action === 'やり直し' && historyValue === maxHistory) ||
           (action === '元に戻す' && historyValue === 0);
  }, [historyValue === maxHistory, historyValue === 0]);

  const toggleSaveState = useCallback(() => {
    setIsSaveState(flag => !flag);
  }, []);

  const setHistoryState = useMemo(() => ({ setUndoRedoState, toggleSaveState }), []);

  return (
    <HistoryContext.Provider value={{
      historyValue, setHistoryValue, maxHistory, setMaxHistory, undoStack, setUndoStack,
      redoStack, setRedoStack, undoRedoState, isSaveState, isActionDisabled
    }}>
      <SetHistoryStateContext.Provider value={ setHistoryState }>
        {children}
      </SetHistoryStateContext.Provider>
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

export const useSetHistoryStateContext = (): SetHistoryStateContextProps => {
  const context = useContext(SetHistoryStateContext);
  if (!context) {
    throw new Error('useSetHistoryStateContext must be used within a CanvasHistoryProvider');
  }
  return context;
}
