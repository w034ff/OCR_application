import { createContext, useContext, ReactNode, useState } from 'react';

interface ResizeRatio {
  isResize: boolean;
  ratio: number;
}

interface ResizeCanvasContextProps {
  resizeRatio: ResizeRatio;
  setResizeRatio: React.Dispatch<React.SetStateAction<ResizeRatio>>;
}

const ResizeCanvasContext = createContext<ResizeCanvasContextProps | undefined>(undefined);

interface ResizeCanvasProviderProps {
  children: ReactNode;
}

export const ResizeCanvasProvider = ({ children }: ResizeCanvasProviderProps): JSX.Element => {
  const [resizeRatio, setResizeRatio] = useState<ResizeRatio>({ isResize: false, ratio: 1 });

  return (
    <ResizeCanvasContext.Provider value={{ resizeRatio, setResizeRatio }}>
      {children}
    </ResizeCanvasContext.Provider>
  );
}

export const useResizeCanvasContext = (): ResizeCanvasContextProps => {
  const context = useContext(ResizeCanvasContext);
  if (!context) {
    throw new Error('ResizeCanvasContext must be used within a ResizeCanvasProvider');
  }
  return context;
}
