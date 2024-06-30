import { createContext, useContext, useCallback, ReactNode, useState } from 'react';

interface CanvasSimpleBarContextProps {
  scrollables: NodeListOf<Element>;
  scrollElement: HTMLElement | null;
  setScrollElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  handleScrollbarToCenter: () => void;
}

const CanvasSimpleBarContext = createContext<CanvasSimpleBarContextProps | undefined>(undefined);

interface CanvasSimpleBarProviderProps {
  children: ReactNode;
}

export const CanvasSimpleBarProvider = ({ children }: CanvasSimpleBarProviderProps): JSX.Element => {
  const scrollables = document.querySelectorAll('.simplebar-scrollable-x, .simplebar-scrollable-y');
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
    <CanvasSimpleBarContext.Provider value={{ scrollables, scrollElement, setScrollElement, handleScrollbarToCenter}}>
      {children}
    </CanvasSimpleBarContext.Provider>
  );
}

export const useCanvasSimpleBarContext = (): CanvasSimpleBarContextProps => {
  const context = useContext(CanvasSimpleBarContext);
  if (!context) {
    throw new Error('useCanvasSimpleBarContext must be used within a CanvasSimpleBarProvider');
  }
  return context;
}
