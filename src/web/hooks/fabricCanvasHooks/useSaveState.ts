import { useEffect } from 'react';
import { useHistoryContext } from '../../CanvasHistoryContext';
import { isNumber } from '../../utils/validators';

// 幅や高さが0以下のオブジェクトを除外し、有効なオブジェクトのみを返す関数
const filterValidObjects = (objects: fabric.Object[]): fabric.Object[] => {
  return objects.filter((obj: fabric.Object) => {
    return (isNumber(obj.width) && obj.width > 0) || (isNumber(obj.height) && obj.height > 0);
  });
};

export const useSaveState = (
  fabricCanvas: fabric.Canvas | null,
  isObjectMovedRef: React.MutableRefObject<boolean>,
  prevCanvasState: fabric.Object[] | null
) => {
	const { setHistoryValue, setMaxHistory, undoStack, setUndoStack, setRedoStack, isSaveState } = useHistoryContext();

  useEffect(() => {
    if (!fabricCanvas) return;

    // キャンバス上のオブジェクトを取得し、高さと幅がゼロでないオブジェクトだけを保持
    const validObjects = filterValidObjects(fabricCanvas.toJSON().objects);
    
    const canvasState: FabricCanvasState = {
      objects: (isObjectMovedRef.current && prevCanvasState) ? prevCanvasState : validObjects,
      width: fabricCanvas.getWidth(),
      height: fabricCanvas.getHeight(),
    };

    const newUndoStack = [...undoStack, canvasState];
    setUndoStack(newUndoStack);
    setRedoStack([]);
    setHistoryValue(newUndoStack.length); 
    setMaxHistory(newUndoStack.length);

    isObjectMovedRef.current = false;
  }, [isSaveState]);
}
