import { useEffect } from 'react';
import { useHistoryContext } from '../../CanvasHistoryContext';
import { useCanvasSimpleBarContext } from '../../CanvasSimpleBarContext';
import { getCurrentFabricCanvasState, applyCanvasState } from '../../utils/canvasUtils';

export const useUndoRedo = (
	fabricCanvas: fabric.Canvas | null,
) => {
  const { setHistoryValue, undoStack, setUndoStack, redoStack, setRedoStack, undoRedoState } = useHistoryContext();
  const { handleScrollbarToCenter } = useCanvasSimpleBarContext();

  // Undo操作が要求された場合に実行される
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
    // Redo用に現在の状態とこれから消去する状態を保存
    setRedoStack(prevRedoStack => [...prevRedoStack, Fabric_state, ...statesToRedo]);

    // 保存された状態を適用し、キャンバスを更新
    if (stateToLoad) {
      applyCanvasState(fabricCanvas, stateToLoad, handleScrollbarToCenter);
    }

    // Undoスタックを更新し、履歴の長さを設定
    setUndoStack(newUndoStack);
    setHistoryValue(newUndoStack.length);
  }, [undoRedoState.isUndo]);

  // Redo操作が要求された場合に実行される
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
    // Undo用に現在の状態とこれから復元する状態を保存
    setUndoStack(prevUndoStack => [...prevUndoStack, Fabric_state, ...statesToUndo]);

     // 保存された状態を適用し、キャンバスを更新
    if (stateToLoad) {
      applyCanvasState(fabricCanvas, stateToLoad, handleScrollbarToCenter);
    }
    
    // Redoスタックを更新し、履歴の長さを設定
    setRedoStack(newRedoStack);
    setHistoryValue(undoStack.length + undoRedoState.count);
  }, [undoRedoState.isRedo]);
};
