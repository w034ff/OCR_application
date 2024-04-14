import React, { useEffect } from 'react';
import { fabric } from 'fabric';
import { useHistoryContext } from '../CanvasHistoryContext';
import { useCanvasToolsContext } from '../CanvasToolsContext';
import { isNumber } from '../utils/IsNumber';


const getCurrentFabricCanvasState = (fabricCanvas: fabric.Canvas): FabricCanvasState => {
	return {
		objects: fabricCanvas.toJSON(['objects']).objects,
		width: fabricCanvas.getWidth(),
		height: fabricCanvas.getHeight()
	};
}

const applyCanvasState = (
  fabricCanvas: fabric.Canvas,
  state: FabricCanvasState,
  handleScrollbarToCenter: () => void
) => {
  if (fabricCanvas.getWidth() !== state.width || fabricCanvas.getHeight() !== state.height) {
    fabricCanvas.setWidth(state.width);
    fabricCanvas.setHeight(state.height);
    handleScrollbarToCenter();
  }
  fabricCanvas.loadFromJSON(state, () => {
    // JSONからキャンバスの状態が復元された後、各オブジェクトに対しての設定を維持させる
    fabricCanvas.forEachObject((obj: fabric.Object) => {
      if (obj.type === 'rect') {
        obj.set({ lockRotation: true, strokeUniform: true });
      } else if (obj.type === 'image' && isNumber(obj.width) && isNumber(obj.height) && obj.width >= fabricCanvas.getWidth() && obj.height >= fabricCanvas.getHeight()) {
        obj.set({ selectable: false, evented: false, hasControls: false, hasBorders: false });
      }
    });
    fabricCanvas.renderAll(); // 変更を適用してキャンバスを再描画
  });
};


export const useUndo = (
  isUndo: boolean,
	fabricCanvas: fabric.Canvas | null,
	undoStack: FabricCanvasState[],
	setUndoStack: React.Dispatch<React.SetStateAction<FabricCanvasState[]>>,
	setRedoStack: React.Dispatch<React.SetStateAction<FabricCanvasState[]>>,
	count: number = 1
) => {
  const { setHistoryValue, setLastHistoryValue } = useHistoryContext();
  const { handleScrollbarToCenter } = useCanvasToolsContext();

  useEffect(() => {
    if (undoStack.length < count || !fabricCanvas) return;

    const newUndoStack = [...undoStack];
    const Fabric_state = getCurrentFabricCanvasState(fabricCanvas);

    let stateToLoad: FabricCanvasState | undefined;
    const statesToRedo: FabricCanvasState[] = [];
    for (let i = 0; i < count; i++) {
      const state = newUndoStack.pop();
      if (state) {
        if (i === count - 1) {
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
    setLastHistoryValue(newUndoStack.length);
  }, [isUndo]);
};


export const useRedo = (
  isRedo: boolean,
	fabricCanvas: fabric.Canvas | null,
	undoStack: FabricCanvasState[],
	redoStack: FabricCanvasState[],
	setUndoStack: React.Dispatch<React.SetStateAction<FabricCanvasState[]>>,
	setRedoStack: React.Dispatch<React.SetStateAction<FabricCanvasState[]>>,
	count: number = 1
) => {
  const { setHistoryValue, setLastHistoryValue } = useHistoryContext();
  const { handleScrollbarToCenter } = useCanvasToolsContext();

  useEffect(() => {
    if (redoStack.length === 0 || !fabricCanvas) return;

    const newRedoStack = [...redoStack];
    const Fabric_state = getCurrentFabricCanvasState(fabricCanvas);

    let stateToLoad: FabricCanvasState | undefined;
    const statesToUndo: FabricCanvasState[] = [];
    for (let i = 0; i < count; i++) {
      const state = newRedoStack.pop();
      if (state) {
        if (i === count - 1) {
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
    setHistoryValue(undoStack.length + count);
    setLastHistoryValue(undoStack.length + count);

  }, [isRedo]);
};
