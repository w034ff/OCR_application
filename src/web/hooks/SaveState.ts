import React, { useEffect } from 'react';
import { fabric } from 'fabric';
import { useHistoryContext } from '../CanvasHistoryContext';


export const useSaveState = (
  fabricCanvas: fabric.Canvas | null,
	undoStack: FabricCanvasState[],
  setUndoStack: React.Dispatch<React.SetStateAction<FabricCanvasState[]>>,
  setRedoStack: React.Dispatch<React.SetStateAction<FabricCanvasState[]>>,
) => {
	const { isSaveState, setHistoryValue, setLastHistoryValue, setMaxHistory } = useHistoryContext();
  
  useEffect(() => {
    if (!fabricCanvas) return;

    const canvasState: FabricCanvasState = {
      objects: fabricCanvas.toJSON(['objects']).objects,
      width: fabricCanvas.getWidth(),
      height: fabricCanvas.getHeight(),
    };

    const newUndoStack = [...undoStack, canvasState];
    setUndoStack(newUndoStack);
    setRedoStack([]);
    setHistoryValue(newUndoStack.length); 
    setLastHistoryValue(newUndoStack.length);
    setMaxHistory(newUndoStack.length);
  }, [isSaveState]);
}
