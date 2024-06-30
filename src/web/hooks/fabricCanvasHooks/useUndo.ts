import { useEffect } from 'react';
import { useHistoryContext } from '../../CanvasHistoryContext';
import { useCanvasSimpleBarContext } from '../../CanvasSimpleBarContext';
import { getCurrentFabricCanvasState, applyCanvasState } from '../../utils/canvasUtils';

export const useUndo = (
	fabricCanvas: fabric.Canvas | null,
) => {
  const { setHistoryValue, undoStack, setUndoStack, setRedoStack, undoRedoState } = useHistoryContext();
  const { handleScrollbarToCenter } = useCanvasSimpleBarContext();

  useEffect(() => {
    if (undoStack.length < undoRedoState.count || !fabricCanvas) return;

    const newUndoStack = [...undoStack];
    const Fabric_state = getCurrentFabricCanvasState(fabricCanvas);

    let stateToLoad: FabricCanvasState | undefined;
    const statesToRedo: FabricCanvasState[] = [];
    for (let i = 0; i < undoRedoState.count; i++) {
      const state = newUndoStack.pop();
      if (state) {
        if (i === undoRedoState.count - 1) {
          stateToLoad = state;
          break;
        }
        statesToRedo.push(state);
      }
    }
    setRedoStack(prevRedoStack => [...prevRedoStack, Fabric_state, ...statesToRedo]);

    if (stateToLoad) {
      applyCanvasState(fabricCanvas, stateToLoad, handleScrollbarToCenter);
    }

    setUndoStack(newUndoStack);
    setHistoryValue(newUndoStack.length);
  }, [undoRedoState.isUndo]);
};
