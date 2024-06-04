import { useEffect } from 'react';
import { useHistoryContext } from '../CanvasHistoryContext';


export const useSaveState = (
  fabricCanvas: fabric.Canvas | null,
) => {
	const { isSaveState, setHistoryValue, setMaxHistory, undoStack, setUndoStack, setRedoStack } = useHistoryContext();
  
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
    setMaxHistory(newUndoStack.length);
  }, [isSaveState]);
}
