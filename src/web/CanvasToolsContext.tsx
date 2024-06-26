import { createContext, useContext, useCallback, ReactNode, useState } from 'react';

interface CanvasToolsContextProps {
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  zoomScaleValue: number;
  setZoomScaleValue: React.Dispatch<React.SetStateAction<number>>;
  scaleUpdateFlag: boolean;
  setScaleUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
  scrollElement: HTMLElement | null;
  setScrollElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  handleScrollbarToCenter: () => void;
}

const CanvasToolsContext = createContext<CanvasToolsContextProps | undefined>(undefined);

interface CanvasToolsProviderProps {
  children: ReactNode;
}

export const CanvasToolsProvider = ({ children }: CanvasToolsProviderProps): JSX.Element => {
  const [scale, setScale] = useState<number>(1);
  const [zoomScaleValue, setZoomScaleValue] = useState<number>(1);
  const [scaleUpdateFlag, setScaleUpdateFlag] = useState(false);
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);


  const handleScrollbarToCenter = useCallback(() => {
    if (scrollElement) {
      const centerScrollX = (scrollElement.scrollWidth - scrollElement.clientWidth) / 2;
      const centerScrollY = (scrollElement.scrollHeight - scrollElement.clientHeight) / 2;
      scrollElement.scrollLeft = centerScrollX;
      scrollElement.scrollTop = centerScrollY;
    }
  }, [scrollElement]);

  return (
    <CanvasToolsContext.Provider value={{
      scale, setScale, zoomScaleValue, setZoomScaleValue, scaleUpdateFlag, setScaleUpdateFlag,
      scrollElement, setScrollElement, handleScrollbarToCenter
    }}>
        {children}
    </CanvasToolsContext.Provider>
  );
}

export const useCanvasToolsContext = (): CanvasToolsContextProps => {
  const context = useContext(CanvasToolsContext);
  if (!context) {
    throw new Error('useCanvasToolsContext must be used within a CanvasToolsProvider');
  }
  return context;
}
