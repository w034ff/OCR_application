import { createContext, useContext, ReactNode, useState } from 'react';


interface EditCanvasToolsContextProps {
  isTrimCanvas: boolean;
  setIsTrimCanvas: React.Dispatch<React.SetStateAction<boolean>>;
  trimRegionChanged: boolean;
  setTrimRegionChanged: React.Dispatch<React.SetStateAction<boolean>>;
  isTrimAspectRatioLocked: boolean;
  setIsTrimAspectRatioLocked: React.Dispatch<React.SetStateAction<boolean>>;
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


const EditCanvasToolsContext = createContext<EditCanvasToolsContextProps | undefined>(undefined);

interface EditCanvasToolsProviderProps {
  children: ReactNode;
}

export const EditCanvasToolsProvider = ({ children }: EditCanvasToolsProviderProps): JSX.Element => {
  const [isTrimCanvas, setIsTrimCanvas] = useState<boolean>(false);
  const [trimRegionChanged, setTrimRegionChanged] = useState<boolean>(false);
  const [isTrimAspectRatioLocked, setIsTrimAspectRatioLocked] = useState<boolean>(false);
  const [currentCanvasWidth, setCurrentCanvasWidth] = useState<number>(800);
  const [currentCanvasHeight, setCurrentCanvasHeight] = useState<number>(600);
  const [trimRegionWidth, setTrimRegionWidth] = useState<number>(800);
  const [trimRegionHeight, setTrimRegionHeight] = useState<number>(600);

  const [ rotate90, setRotate90 ] = useState<number>(0); // +1: 右へ90度回転, -1: 左へ90度回転
  const [ flipState, setFlipState ] = useState<number>(0); // +1: 垂直反転, -1: 水平反転

  return (
    <EditCanvasToolsContext.Provider value = {{
      isTrimCanvas, setIsTrimCanvas,
      trimRegionChanged, setTrimRegionChanged, isTrimAspectRatioLocked, setIsTrimAspectRatioLocked,
      currentCanvasWidth, setCurrentCanvasWidth, currentCanvasHeight, setCurrentCanvasHeight,
      trimRegionWidth, setTrimRegionWidth, trimRegionHeight, setTrimRegionHeight,
      rotate90, setRotate90, flipState, setFlipState
    }}>
      {children}
    </EditCanvasToolsContext.Provider>
  );
}

export const useEditCanvasToolsContext = (): EditCanvasToolsContextProps => {
  const ToolsContext = useContext(EditCanvasToolsContext);
  if (!ToolsContext) {
    throw new Error('EditCanvasToolsContext must be used within a EditCanvasToolsProvider');
  }
  return ToolsContext;
}
