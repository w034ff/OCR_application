import { useEffect, useState, useRef } from 'react';
import { fabric } from 'fabric';
import { useInitializeFabricCanvas } from './hooks/fabricCanvasHooks/useInitializeFabricCanvas';
import { useSaveState } from './hooks/fabricCanvasHooks/useSaveState';
import { useLoadImageURL } from './hooks/useLoadImageURL';
import { useEditFabricCanvas } from './hooks/editFabricCanvasHooks/useEditFabricCanvas';
import { useAddRectObject } from './hooks/fabricCanvasHooks/useAddRectObject';
import { useFabricCanvasSelection } from './hooks/fabricCanvasHooks/useFabricCanvasSelection';
import { useActiveObject } from './hooks/fabricCanvasHooks/useActiveObject';
import { useSetHistoryStateContext } from './CanvasHistoryContext';
import { useSidebarStateContext } from './components/SideBar/SidebarStateContext';
import { useUndo } from './hooks/fabricCanvasHooks/useUndo';
import { useRedo } from './hooks/fabricCanvasHooks/useRedo';
import { addGridLines } from './utils/gridLinesUtils';
import { handleScrollbarClick } from './utils/clickEventUtils';

export const useDrawFabricCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  editCanvasRef:React.RefObject<HTMLCanvasElement>,
) => {
  const { toggleSaveState } = useSetHistoryStateContext();
  const { drawingMode, setDrawingMode } = useSidebarStateContext();
  const gridLabelRef = useRef(0);
  const isObjectMoving = useRef<boolean>(false);
  const prevCanvasState = useRef<fabric.Object[] | null>(null);
  const gridLinesDataRef = useRef<{ gridLines: fabric.Line[], maxSize: number }[]>([]);

  // 描画用fabricキャンバスと切り取り領域用fabricキャンバスを初期化するカスタムフック
  const { fabricCanvas, fabricEditCanvas } = useInitializeFabricCanvas(canvasRef, editCanvasRef);
  // fabricキャンバスのRectオブジェクトを追加するカスタムフック
  useAddRectObject(fabricCanvas);
  // drawing-canvasの状態を保存するカスタムフック（Undo, Redoの実行に不可欠なカスタムフック）
  useSaveState(fabricCanvas, isObjectMoving.current, prevCanvasState.current);
  // drawing-canvasをUndoするカスタムフック
  useUndo(fabricCanvas);
  // drawing-canvasをRedoするカスタムフック
  useRedo(fabricCanvas);
  // Fabricキャンバスに画像を挿入するカスタムフック
  useLoadImageURL(fabricCanvas, canvasRef);
  // キャンバスのトリミング領域を設定および管理するためのカスタムフック
  useEditFabricCanvas(fabricCanvas, fabricEditCanvas, canvasRef);
  // FabricJSのselectionを制御するカスタムフック
  useFabricCanvasSelection(fabricCanvas, gridLinesDataRef);
  // gridLineの移動する範囲を制限するカスタムフック
  useActiveObject(fabricCanvas, gridLinesDataRef.current)

  // console.log("render canvasDraw")
  useEffect(() => {
    const handleMouseDownOutsideCanvas = (e: MouseEvent) => {
      if (!fabricCanvas) return;
  
      const canvasRect = fabricCanvas.getElement().getBoundingClientRect();
      const { clientX: x, clientY: y } = e;
  
      const isOutsideCanvas = 
        x < canvasRect.left || x > canvasRect.right ||
        y < canvasRect.top || y > canvasRect.bottom;
  
      if (isOutsideCanvas) {
        isObjectMoving.current = false;
        fabricCanvas.discardActiveObject();
        fabricCanvas.requestRenderAll();
      }
    };
  
    window.addEventListener('mousedown', handleMouseDownOutsideCanvas);
  
    return () => {
      window.removeEventListener('mousedown', handleMouseDownOutsideCanvas);
    };
  }, [fabricCanvas]);


  useEffect(() => {
    if (drawingMode === 'rect' && fabricCanvas) {
      prevCanvasState.current = fabricCanvas.toJSON().objects;
    } else if (drawingMode === 'grid' && fabricCanvas) {
      addGridLines(fabricCanvas, gridLabelRef, gridLinesDataRef, setDrawingMode);
    }
  }, [fabricCanvas, drawingMode]);
  
  useEffect(() => {
    if (!fabricCanvas) return;

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
