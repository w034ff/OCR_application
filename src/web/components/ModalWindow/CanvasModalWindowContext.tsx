import { createContext, useContext, ReactNode, useState } from 'react';


interface CanvasModalWindowContextProps {
  canvasModalMode: string;
  setCanvasModalMode: React.Dispatch<React.SetStateAction<string>>;
  resizeRatio: number;
  setResizeRatio: React.Dispatch<React.SetStateAction<number>>;
}

const CanvasModalWindowContext = createContext<CanvasModalWindowContextProps | undefined>(undefined);

interface CanvasModalWindowProviderProps {
  children: ReactNode;
}

export const CanvasModalWindowProvider = ({ children }: CanvasModalWindowProviderProps): JSX.Element => {
  const [canvasModalMode, setCanvasModalMode] = useState<string>("");
  const [resizeRatio, setResizeRatio] = useState<number>(1);

  return (
      <CanvasModalWindowContext.Provider value = {{
        canvasModalMode, setCanvasModalMode, resizeRatio, setResizeRatio
      }}>
        {children}
      </CanvasModalWindowContext.Provider>
  );
}

export const useCanvasModalWindowContext = (): CanvasModalWindowContextProps => {
  const ScaleModalContext = useContext(CanvasModalWindowContext);
  if (!ScaleModalContext) {
    throw new Error('CanvasModalWindowContext must be used within a CanvasModalWindowProvider');
  }
  return ScaleModalContext;
}
