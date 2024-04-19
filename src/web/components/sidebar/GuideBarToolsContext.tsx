import React, { createContext, useContext, ReactNode, useState, JSX } from 'react';


interface GuideBarToolsContextProps {
  isTrimCanvas: boolean;
  setIsTrimCanvas: React.Dispatch<React.SetStateAction<boolean>>;
  trimRegionChanged: boolean;
  setTrimRegionChanged: React.Dispatch<React.SetStateAction<boolean>>;
  isAspectRatioChecked: boolean;
  setIsAspectRatioChecked: React.Dispatch<React.SetStateAction<boolean>>;
  currentCanvasWidth: number;
  setCurrentCanvasWidth: React.Dispatch<React.SetStateAction<number>>;
  currentCanvasHeight: number;
  setCurrentCanvasHeight: React.Dispatch<React.SetStateAction<number>>;
  trimRegionWidth: number;
  setTrimRegionWidth: React.Dispatch<React.SetStateAction<number>>;
  trimRegionHeight: number;
  setTrimRegionHeight: React.Dispatch<React.SetStateAction<number>>;
  rotate90: number;
  setRotate90: React.Dispatch<React.SetStateAction<number>>;
  flipState: number;
  setFlipState: React.Dispatch<React.SetStateAction<number>>;
}


const GuideBarToolsContext = createContext<GuideBarToolsContextProps | undefined>(undefined);

interface GuideBarToolsProviderProps {
  children: ReactNode;
}

export const GuideBarToolsProvider = ({ children }: GuideBarToolsProviderProps): JSX.Element => {
  const [isTrimCanvas, setIsTrimCanvas] = useState<boolean>(false);
  const [trimRegionChanged, setTrimRegionChanged] = useState<boolean>(false);
  const [isAspectRatioChecked, setIsAspectRatioChecked] = useState<boolean>(false);
  const [currentCanvasWidth, setCurrentCanvasWidth] = useState<number>(800);
  const [currentCanvasHeight, setCurrentCanvasHeight] = useState<number>(600);
  const [trimRegionWidth, setTrimRegionWidth] = useState<number>(800);
  const [trimRegionHeight, setTrimRegionHeight] = useState<number>(600);

  const [ rotate90, setRotate90 ] = useState<number>(0); // +1: 右へ90度回転, -1: 左へ90度回転
  const [ flipState, setFlipState ] = useState<number>(0); // +1: 垂直反転, -1: 水平反転

  return (
    <GuideBarToolsContext.Provider value = {{
      isTrimCanvas, setIsTrimCanvas,
      trimRegionChanged, setTrimRegionChanged, isAspectRatioChecked, setIsAspectRatioChecked,
      currentCanvasWidth, setCurrentCanvasWidth, currentCanvasHeight, setCurrentCanvasHeight,
      trimRegionWidth, setTrimRegionWidth, trimRegionHeight, setTrimRegionHeight,
      rotate90, setRotate90, flipState, setFlipState
    }}>
      {children}
    </GuideBarToolsContext.Provider>
  );
}

export const useGuideBarToolsContext = (): GuideBarToolsContextProps => {
  const ToolsContext = useContext(GuideBarToolsContext);
  if (!ToolsContext) {
    throw new Error('GuideBarToolsContext must be used within a GuideBarToolsProvider');
  }
  return ToolsContext;
}
