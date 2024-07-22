import { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { useInitializeFabricCanvas } from './hooks/fabricCanvasHooks/useInitializeFabricCanvas';
import { useSaveState } from './hooks/fabricCanvasHooks/useSaveState';
import { useLoadImageURL } from './hooks/useLoadImageURL';
import { useEditFabricCanvas } from './hooks/editFabricCanvasHooks/useEditFabricCanvas';
import { useSetHistoryStateContext } from './CanvasHistoryContext';
import { useCanvasToolsContext} from './CanvasToolsContext'
import { useSidebarStateContext } from './components/SideBar/SidebarStateContext';
import { useUndo } from './hooks/fabricCanvasHooks/useUndo';
import { useRedo } from './hooks/fabricCanvasHooks/useRedo';
import { isNumber } from './utils/validators';
import { addRectProps } from './hooks/editFabricCanvasHooks/createRectProps';
import { handleScrollbarClick } from './utils/clickEventUtils';

export const useDrawFabricCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  editCanvasRef:React.RefObject<HTMLCanvasElement>,
) => {
  const { toggleSaveState } = useSetHistoryStateContext();
  const { scale } = useCanvasToolsContext();
  const { drawingMode, setDrawingMode } = useSidebarStateContext();
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
  useLoadImageURL(fabricCanvas, canvasRef);
  // キャンバスのトリミング領域を設定および管理するためのカスタムフック
  useEditFabricCanvas(fabricCanvas, fabricEditCanvas, canvasRef);

  // console.log("render canvasDraw")

  const createGrid = (pointer: {x: number, y: number}, canvas: fabric.Canvas, gridSize: number, spacing: number) => {
    const rect = new fabric.Rect({
      // left: pointer.x,
      // top: pointer.y,
      // originX: "center",
      // originY: "center",
      width: gridSize * spacing,
      height: gridSize * spacing,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 3 / scale,
      selectable: false,
      hasControls: false,
      hasBorders: false,
      perPixelTargetFind: true,
    });
    const gridLines: fabric.Line[] = [];

    for (let i = 0; i <= gridSize; i++) {
      const lineX = new fabric.Line([i * spacing, 0, i * spacing, gridSize * spacing], {
        row: null,
        col: i,
        stroke: "black",
        strokeWidth: 3 / scale,
        // clipPath: rect,
        // perPixelTargetFind: true,
        selectable: true, // オブジェクトを選択可能に
    lockScalingX: false, // X軸のスケーリングを許可
    lockScalingY: false, // Y軸のスケーリングを許可
        hasControls: true,
      });
      const lineY = new fabric.Line([0, i * spacing, gridSize * spacing, i * spacing], {
        row: i,
        col: null,
        stroke: "black",
        strokeWidth: 3 / scale,
        // clipPath: rect,
        hasControls: true,
        selectable: true, // オブジェクトを選択可能に
    lockScalingX: false, // X軸のスケーリングを許可
    lockScalingY: false, // Y軸のスケーリングを許可
        // perPixelTargetFind: true,
      });
  
      gridLines.push(lineX, lineY);
    }
    canvas.on("selection:created", () => {
      const selectedObject = canvas.getActiveObject();
      console.log('sssssssssssss', gridLines, selectedObject)
      if (selectedObject instanceof fabric.Line && gridLines.includes(selectedObject)) {
        const row = selectedObject.row;
        const col = selectedObject.col;
        console.log(`Selected line: row ${row}, col ${col}`);
        // ここで、選択された行と列の情報を利用できます。
      }
    });
    const group = new fabric.Group([rect, ...gridLines], {
      left: pointer.x,
      top: pointer.y,
      originX: "left",
      originY: "top",
      width: gridSize * spacing,
      height: gridSize * spacing,
      // perPixelTargetFind: true,
      // subTargetCheck: true, // グループ内のオブジェクトを選択可能にする
    });
    group.on("mousedown", (e) => {
      if (e.subTargets && e.subTargets.length > 0) {
        const clickedObject = e.subTargets[0]; // クリックされたオブジェクト
        console.log("Clicked object:", clickedObject, e.target);
        if (gridLines.includes(clickedObject as fabric.Line)) {
          e.e.stopImmediatePropagation();
          canvas.setActiveObject(clickedObject);
          canvas.requestRenderAll();
      return; // グループの操作を停止
        }
      }
    });

    // group.setControlsVisibility({ mtr: false });
    canvas.add(...gridLines ); 
    // canvas.setActiveObject(group);
    setDrawingMode('');
  }
  
  useEffect(() => {
    if (!fabricCanvas) return;
    const startDrawing = (o: fabric.IEvent) => {
      fabricCanvas.selection = false;
      const pointer = fabricCanvas.getPointer(o.e);
      if (drawingMode === 'rect') {
        const rect = new fabric.Rect(addRectProps(pointer, scale));
        setStartPoint(rect);
        rect.setControlsVisibility({ mtr: false });
        fabricCanvas.add(rect);
      } else if (drawingMode === 'grid') {
        createGrid(pointer, fabricCanvas, 4, 75);
      }
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
        // 75px以上の四角形を追加する
        startPoint.set({
          width: Math.max(75, startPoint.getScaledWidth()),
          height: Math.max(75, startPoint.getScaledHeight()),
        })
        fabricCanvas.setActiveObject(startPoint);
        setStartPoint(null);
        setDrawingMode('');
        fabricCanvas.renderAll();
      }
      fabricCanvas.selection = true;
    };

    const handleMouseDown = (o: fabric.IEvent) => {
      if (o.e instanceof MouseEvent && handleScrollbarClick(o.e)) {
        fabricCanvas.selection = false;
        const activeObject = fabricCanvas.getActiveObject();
        if (activeObject) {
          toggleSaveState();
        }
        return; // スクロールバーがクリックされたので、他の処理をスキップ
      }

      if (fabricCanvas.getActiveObject()) {
        // 既にアクティブなオブジェクトがある場合の処理
        // ここで不適切な位置変更が行われていないか確認
      } else if (drawingMode === '') {
        return;
      } else if (drawingMode === 'rect' || drawingMode === 'grid') {
        startDrawing(o);
      }
      toggleSaveState();
    };

    const handleSelectionCreated = () => {
      const group = fabricCanvas.getActiveObject();
      if (group && group.type === 'activeSelection') {
        group.set({
          borderColor: 'red',
          cornerSize: 24,
          cornerStrokeColor: '#0064b6',
          lockRotation: true,
        });
        group.setControlsVisibility({ mtr: false });
      }
      fabricCanvas.renderAll();
    };

    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:move', keepDrawing);
    fabricCanvas.on('mouse:up', finishDrawing);
    fabricCanvas.on('selection:created', handleSelectionCreated);

    return () => {
      fabricCanvas.off('mouse:down', handleMouseDown);
      fabricCanvas.off('mouse:move', keepDrawing);
      fabricCanvas.off('mouse:up', finishDrawing);
      fabricCanvas.off('selection:created', handleSelectionCreated);
    };
  }, [fabricCanvas, scale, startPoint, drawingMode]);
}
