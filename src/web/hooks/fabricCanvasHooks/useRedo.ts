import { useEffect } from 'react';
import { useHistoryContext } from '../../CanvasHistoryContext';
import { useCanvasToolsContext } from '../../CanvasToolsContext';
import { getCurrentFabricCanvasState, applyCanvasState } from '../../utils/canvasUtils';

export const useRedo = (
	fabricCanvas: fabric.Canvas | null,
) => {
  const { setHistoryValue, undoStack, setUndoStack, redoStack, setRedoStack, undoRedoState } = useHistoryContext();
  const { handleScrollbarToCenter } = useCanvasToolsContext();

  useEffect(() => {
    if (redoStack.length === 0 || !fabricCanvas) return;

    const newRedoStack = [...redoStack];
    const Fabric_state = getCurrentFabricCanvasState(fabricCanvas);

    let stateToLoad: FabricCanvasState | undefined;
    const statesToUndo: FabricCanvasState[] = [];
    for (let i = 0; i < undoRedoState.count; i++) {
      const state = newRedoStack.pop();
      if (state) {
        if (i === undoRedoState.count - 1) {
          stateToLoad = state;
          break;
        }
        statesToUndo.push(state);
      }
    }
    setUndoStack(prevUndoStack => [...prevUndoStack, Fabric_state, ...statesToUndo]);

    if (stateToLoad) {
      applyCanvasState(fabricCanvas, stateToLoad, handleScrollbarToCenter);
    }
        
    setRedoStack(newRedoStack);
    setHistoryValue(undoStack.length + undoRedoState.count);
  }, [undoRedoState.isRedo]);
};
