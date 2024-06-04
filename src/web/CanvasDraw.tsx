import { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { useSaveState } from './hooks/SaveState';
import { useLoadImageURL } from './hooks/useLoadImageURL';
import { useEditFabricCanvas } from './components/canvasTrimHooks/useEditFabricCanvas';
import { useHistoryContext } from './CanvasHistoryContext';
import { useCanvasToolsContext} from './CanvasToolsContext'
import { useUndo, useRedo } from './hooks/UndoRedo';


export const useDrawFabricCanvas = (
  drawing: boolean,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  editCanvasRef:React.RefObject<HTMLCanvasElement>,
  containerRef: React.RefObject<HTMLDivElement>,
) => {
	const { setIsSaveState, setUndoRedoState } = useHistoryContext();
  const { scale } = useCanvasToolsContext();
  const [drawingMode, setDrawingMode] = useState('lin'); // 'line' または 'rect'
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [startPoint, setStartPoint] = useState<fabric.Rect | null>(null);


  // カスタムフックを使用
  useSaveState(fabricCanvas);

  useUndo(fabricCanvas);
  useRedo(fabricCanvas);
  // Fabricキャンバスに画像を挿入するカスタムフック
  useLoadImageURL(fabricCanvas, canvasRef, containerRef);
  //  キャンバスのトリミング領域を設定および管理するためのカスタムフック
  useEditFabricCanvas(fabricCanvas, canvasRef, editCanvasRef);

  // console.log("render canvasDraw")

  



  useEffect(() => {
    if (canvasRef.current && !fabricCanvas) {
      const newFabricCanvas = new fabric.Canvas(canvasRef.current);
      newFabricCanvas.uniformScaling = false;
      setFabricCanvas(newFabricCanvas);
    }
  }, [canvasRef]);

  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!fabricCanvas || !canvas) return;
    const startDrawing = (o: fabric.IEvent) => {
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
      if (!drawing || !startPoint || startPoint.left === undefined || startPoint.top === undefined) return;
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
      } else if (drawingMode === 'lin' && !drawing) {
        startDrawing(o);
      }
      console.log(drawing)
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
  }, [fabricCanvas, drawing, startPoint, scale]);

};
