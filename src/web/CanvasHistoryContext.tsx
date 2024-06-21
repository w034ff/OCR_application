import { createContext, useContext, ReactNode, useState } from 'react';

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
  setUndoRedoState: React.Dispatch<React.SetStateAction<UndoRedoState>>;
}

const HistoryContext = createContext<HistoryContextProps | undefined>(undefined);

interface CanvasHistoryProviderProps {
  children: ReactNode;
}

export const CanvasHistoryProvider = ({ children }: CanvasHistoryProviderProps): JSX.Element => {
  const [historyValue, setHistoryValue] = useState<number>(0);
  const [maxHistory, setMaxHistory] = useState<number>(0);

  const [undoStack, setUndoStack] = useState<FabricCanvasState[]>([]);
  const [redoStack, setRedoStack] = useState<FabricCanvasState[]>([]);
  const [undoRedoState, setUndoRedoState] = useState<UndoRedoState>({ isUndo: false, isRedo: false, count: 1});

  return (
    <HistoryContext.Provider value={{
      historyValue, setHistoryValue, 
      maxHistory, setMaxHistory,undoStack, setUndoStack,
      redoStack, setRedoStack, undoRedoState, setUndoRedoState
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
