import { useEffect, useState, useRef } from 'react';
import { fabric } from 'fabric';
import { useSaveState } from './hooks/SaveState';
import { useLoadImageURL } from './hooks/LoadImageURL';
import { useEditFabricCanvas } from './components/canvasTrimHooks/useEditFabricCanvas';
import { useHistoryContext } from './CanvasHistoryContext';
import { useCanvasToolsContext} from './CanvasToolsContext'
import { useUndo, useRedo } from './hooks/UndoRedo';

enum ActionType {
	Undo = "Undo",
	Redo = "Redo"
}


export const useDrawFabricCanvas = (
  drawing: boolean,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  editCanvasRef:React.RefObject<HTMLCanvasElement>,
  containerRef: React.RefObject<HTMLDivElement>,
  PerformCanvasActionRef: React.MutableRefObject<((action: string, count: number) => void) | undefined>,
  handleImageUrlReceiveRef: React.MutableRefObject<((ImageURL: string) => void) | undefined>,
) => {
	const { setIsSaveState } = useHistoryContext();
  const { scale } = useCanvasToolsContext();
  const [drawingMode, setDrawingMode] = useState('lin'); // 'line' または 'rect'
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [startPoint, setStartPoint] = useState<fabric.Rect | null>(null);
  
  const [undoStack, setUndoStack] = useState<FabricCanvasState[]>([]);
  const [redoStack, setRedoStack] = useState<FabricCanvasState[]>([]);
  const [isUndo, setIsUndo] = useState<boolean>(false);
  const [isRedo, setIsRedo] = useState<boolean>(false);
  const [countUndoRedo, setCountUndoRedo] = useState<number>(1);
  
  const [imageURL, setImageURL] = useState<string>('');

  // カスタムフックを使用
  useSaveState(fabricCanvas, undoStack, setUndoStack, setRedoStack);
  //  同じ画像を連続して挿入できないようにしたカスタムフック(改良すれば連続して画像を挿入可)
  useLoadImageURL(fabricCanvas, canvasRef, containerRef)(imageURL);

  useUndo(isUndo, fabricCanvas, undoStack, setUndoStack, setRedoStack, countUndoRedo);
  useRedo(isRedo, fabricCanvas, undoStack, redoStack, setUndoStack, setRedoStack, countUndoRedo);
  //  キャンバスのトリミング領域を設定および管理するためのカスタムフック
  useEditFabricCanvas(fabricCanvas, canvasRef, editCanvasRef);

  // console.log("render canvasDraw")

  const performCanvasAction = (action: string, count: number = 1) => {
    switch (action) {
      case ActionType.Undo:
        setIsUndo(flag => !flag);
        break;
      case ActionType.Redo:
        setIsRedo(flag => !flag);
        break;
      default:
        throw new Error("No active window found");
    }
    setCountUndoRedo(count);
  };
  
  PerformCanvasActionRef.current = (action: string, count: number) => {
    performCanvasAction(action, count);
  };


  handleImageUrlReceiveRef.current = (ImageURL: string) => {
    setImageURL(ImageURL);
  }


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
        performCanvasAction(ActionType.Undo);
      }
      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        performCanvasAction(ActionType.Redo);
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
