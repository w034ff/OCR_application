import { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { useInitializeFabricCanvas } from './hooks/fabricCanvasHooks/useInitializeFabricCanvas';
import { useSaveState } from './hooks/fabricCanvasHooks/useSaveState';
import { useLoadImageURL } from './hooks/useLoadImageURL';
import { useEditFabricCanvas } from './hooks/editFabricCanvasHooks/useEditFabricCanvas';
import { useHistoryContext } from './CanvasHistoryContext';
import { useCanvasToolsContext} from './CanvasToolsContext'
import { useSaveStateContext } from './CanvasSaveStateContext';
import { useUndo } from './hooks/fabricCanvasHooks/useUndo';
import { useRedo } from './hooks/fabricCanvasHooks/useRedo';
import { isNumber } from './utils/validators';


export const useDrawFabricCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  editCanvasRef:React.RefObject<HTMLCanvasElement>,
  containerRef: React.RefObject<HTMLDivElement>,
) => {
  const { setIsSaveState } = useSaveStateContext()
	const { setUndoRedoState } = useHistoryContext();
  const { scale } = useCanvasToolsContext();
  const [drawingMode, setDrawingMode] = useState('lin'); // 'line' または 'rect'
  const [startPoint, setStartPoint] = useState<fabric.Rect | null>(null);

  // 描画用fabricキャンバスと切り取り領域用fabricキャンバスを初期化するカスタムフック
  const { fabricCanvas, fabricEditCanvas } = useInitializeFabricCanvas(canvasRef, editCanvasRef);

  // drawing-canvasの状態を保存するカスタムフック（Undo, Redoの実行に不可欠なカスタムフック）
  useSaveState(fabricCanvas);
  // drawing-canvasをUndoするカスタムフック
  useUndo(fabricCanvas);
  // drawing-canvasをRedoするカスタムフック
  useRedo(fabricCanvas);
  // Fabricキャンバスに画像を挿入するカスタムフック
  useLoadImageURL(fabricCanvas, canvasRef, containerRef);
  //  キャンバスのトリミング領域を設定および管理するためのカスタムフック
  useEditFabricCanvas(fabricCanvas, fabricEditCanvas, canvasRef);

  // console.log("render canvasDraw")
  
  useEffect(() => {
    // console.log('gggggggggggggggg')
    if (!fabricCanvas) return;
    const startDrawing = (o: fabric.IEvent) => {
      console.log('eeeeeeeeeeeeeeeeeeeeee')
      fabricCanvas.selection = false; 
      const pointer = fabricCanvas.getPointer(o.e);
      const rect = new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        originX: 'left',
        originY: 'top',
        width: 0,
        height: 0,
        stroke: 'black',
        strokeWidth: 3 / scale,
        fill: 'transparent',
        lockRotation: true,
        strokeUniform: true,
        scaleX: 1 / scale,
        scaleY: 1 / scale,
      });
      setStartPoint(rect);
      fabricCanvas.add(rect);
    };

    const keepDrawing = (o: fabric.IEvent) => {
      if (!startPoint || !isNumber(startPoint.left) || !isNumber(startPoint.top)) return;
      const pointer = fabricCanvas.getPointer(o.e);
      // スケーリングされたキャンバスに対するポインタの相対座標を計算
      const xChange = (pointer.x - startPoint.left) * scale;
      const yChange = (pointer.y  - startPoint.top) * scale;

      const width = Math.abs(xChange);
      const height = Math.abs(yChange);

      // 四角形のプロパティを更新
      startPoint.set({
        width: width,
        height: height,
        originX: (xChange > 0) ? 'left' : 'right',
        originY: (yChange > 0) ? 'top' : 'bottom'
      });
      fabricCanvas.renderAll();
    };

    const finishDrawing = () => {
      if (startPoint) {
        // 必要な場合はここで四角形のプロパティを最終調整
        // startPoint.set({ fill: 'blue' });
        fabricCanvas.setActiveObject(startPoint);
        
      }
      fabricCanvas.renderAll();
      setStartPoint(null);
      // setDrawingMode('line');
    };

    const handleMouseDown = (o: fabric.IEvent) => {
      if (fabricCanvas.getActiveObject()) {
        // 既にアクティブなオブジェクトがある場合の処理
        // ここで不適切な位置変更が行われていないか確認
      } else if (drawingMode === 'lin') {
        startDrawing(o);
      }
      console.log('ffffffffffffffffffff')
      setIsSaveState(flag => !flag);
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        setUndoRedoState(prevState => ({...prevState, isUndo: !prevState.isUndo, count: 1}));
      }
      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        setUndoRedoState(prevState => ({...prevState, isRedo: !prevState.isRedo, count: 1}));
      }
    };

    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:move', keepDrawing);
    fabricCanvas.on('mouse:up', finishDrawing);
    document.addEventListener('keydown', handleKeydown);

    return () => {
      fabricCanvas.off('mouse:down', handleMouseDown);
      fabricCanvas.off('mouse:move', keepDrawing);
      fabricCanvas.off('mouse:up', finishDrawing);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [fabricCanvas, startPoint, scale]);

};
