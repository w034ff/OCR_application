import { createContext, useContext, ReactNode, useState } from 'react';

interface GuideBarHiddenContextProps {
  isFlipped: boolean;
  setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;
}

const GuideBarHiddenContext = createContext<GuideBarHiddenContextProps | undefined>(undefined);

interface GuideBarHiddenProviderProps {
  children: ReactNode;
}

export const GuideBarHiddenProvider = ({ children }: GuideBarHiddenProviderProps): JSX.Element => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
      <GuideBarHiddenContext.Provider value = {{ isFlipped, setIsFlipped }}>
        {children}
      </GuideBarHiddenContext.Provider>
  );
}

export const useGuideBarHiddenContext = (): GuideBarHiddenContextProps => {
  const context = useContext(GuideBarHiddenContext);
  if (!context) {
    throw new Error('GuideBarHiddenContext must be used within a GuideBarHiddenProvider');
  }
  return context;
}
