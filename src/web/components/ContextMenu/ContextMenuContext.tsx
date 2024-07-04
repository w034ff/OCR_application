import { createContext, useContext, ReactNode, useState, useCallback } from 'react';

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
}

interface ContextMenuContextProps {
  contextMenu: ContextMenuState;
  setContextMenu: React.Dispatch<React.SetStateAction<ContextMenuState>>;
  closeContextMenu: () => void;
}

const ContextMenuContext = createContext<ContextMenuContextProps | undefined>(undefined);

interface ContextMenuProviderProps {
  children: ReactNode;
}

export const ContextMenuProvider = ({ children }: ContextMenuProviderProps): JSX.Element => {
	const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });

  const closeContextMenu = useCallback(() => {
    setContextMenu({ visible: false, x: 0, y: 0 });
	}, []);

  return (
		<ContextMenuContext.Provider value = {{ contextMenu, setContextMenu, closeContextMenu }}>
			{children}
		</ContextMenuContext.Provider>
  );
}

export const useContextMenuContext = (): ContextMenuContextProps => {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error('ContextMenuContext must be used within a ContextMenuProvider');
  }
  return context;
}
