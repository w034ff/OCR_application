import { createContext, useContext, ReactNode, useState } from 'react';


interface ContextMenuContextProps {
  contextMenu: ContextMenuState;
  setContextMenu: React.Dispatch<React.SetStateAction<ContextMenuState>>;
}

const ContextMenuContext = createContext<ContextMenuContextProps | undefined>(undefined);

interface ContextMenuProviderProps {
  children: ReactNode;
}

export const ContextMenuProvider = ({ children }: ContextMenuProviderProps): JSX.Element => {
	const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });

  console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww')
  return (
		<ContextMenuContext.Provider value = {{ contextMenu, setContextMenu }}>
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
