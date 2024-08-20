import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { handleScrollbarClick } from '../../utils/clickEventUtils';
import { addGridLines } from '../../utils/gridLinesUtils';
import { useSetHistoryStateContext } from '../../CanvasHistoryContext';
import { useSidebarStateContext } from '../../components/SideBar/SidebarStateContext';
import { useAddRectObject } from './useAddRectObject';

export const useAddObjectToCanvas = (fabricCanvas: fabric.Canvas | null) => {
  const { toggleSaveState } = useSetHistoryStateContext();
  const { drawingMode, setDrawingMode } = useSidebarStateContext();
  const gridLabelRef = useRef(0);
  const isObjectMoving = useRef<boolean>(false);
  const prevCanvasState = useRef<fabric.Object[] | null>(null);
  const gridLinesDataRef = useRef<{ gridLines: fabric.Line[], maxSize: number }[]>([]);

  // fabricキャンバスにRectオブジェクトを追加するカスタムフック
  useAddRectObject(fabricCanvas);

  useEffect(() => {
    if (drawingMode === 'rect' && fabricCanvas) {
      prevCanvasState.current = fabricCanvas.toJSON().objects;
    } else if (drawingMode === 'grid' && fabricCanvas) {
      addGridLines(fabricCanvas, gridLabelRef, gridLinesDataRef, setDrawingMode);
    }
  }, [fabricCanvas, drawingMode]);

  useEffect(() => {
    if (!fabricCanvas) return;

    const handleMouseDown = (o: fabric.IEvent) => {
      isObjectMoving.current = false;
      if (o.e instanceof MouseEvent && handleScrollbarClick(o.e)) {
        fabricCanvas.selection = false;
        const activeObject = fabricCanvas.getActiveObject();
        if (activeObject) {
          prevCanvasState.current = fabricCanvas.toJSON().objects;
        }
        return; // スクロールバーがクリックされたので、他の処理をスキップ
      }

      if (fabricCanvas.getActiveObject()) {
        // 既にアクティブなオブジェクトがある場合の処理
        prevCanvasState.current = fabricCanvas.toJSON().objects;
        return;
      } else if (drawingMode === 'rect') {
        isObjectMoving.current = true;
      }
    };

    const keepDrawing = () => {
      if (fabricCanvas.getActiveObject()) {
        isObjectMoving.current = true;
      }
    };

    const finishDrawing = () => {
      fabricCanvas.selection = true;
      if (isObjectMoving.current
        && prevCanvasState.current !== fabricCanvas.toJSON().objects) {
        toggleSaveState();
      }
    };

    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:move', keepDrawing);
    fabricCanvas.on('mouse:up', finishDrawing);

    return () => {
      fabricCanvas.off('mouse:down', handleMouseDown);
      fabricCanvas.off('mouse:move', keepDrawing);
      fabricCanvas.off('mouse:up', finishDrawing);
    };
  }, [fabricCanvas, drawingMode]);
}
