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
import { isNumber, isActiveSelection } from './utils/validators';
import { addRectProps } from './utils/createRectProps';
import { createGridLinesProps, groupGridLines } from './utils/createGridLinesProps';
import { handleScrollbarClick } from './utils/clickEventUtils';

export const useDrawFabricCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  editCanvasRef:React.RefObject<HTMLCanvasElement>,
) => {
  const { toggleSaveState } = useSetHistoryStateContext();
  const { scale } = useCanvasToolsContext();
  const { drawingMode, setDrawingMode } = useSidebarStateContext();
  const [startPoint, setStartPoint] = useState<fabric.Rect | null>(null);
  const gridLinesData: { gridLines: fabric.Line[], maxSize: number }[] = [];
  let gridLinesGroup: fabric.Group | null = null;

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

  const createGrid = (canvas: fabric.Canvas, gridSize: number, spacing: number) => {
    const gridLines = createGridLinesProps(canvas.getWidth() / 2, canvas.getHeight() / 2, gridSize, spacing, scale);

    canvas.on('selection:created', () => {
      const selectedObjects = canvas.getActiveObject();
      if (selectedObjects && isActiveSelection(selectedObjects)) {
        const objects = selectedObjects.getObjects();
        objects.forEach((obj: fabric.Object) => {
          if (obj instanceof fabric.Line) {
            canvas.discardActiveObject();
            return;
          }
        })
        // selectedObjects.set({
        //   borderColor: 'red',
        //   cornerSize: 24,
        //   cornerStrokeColor: '#0064b6',
        //   lockRotation: true,
        // });
        // selectedObjects.setControlsVisibility({ mtr: false });
      }
      gridLinesGroup = groupGridLines(gridLinesData, selectedObjects, gridLinesGroup, canvas);
    });
    canvas.on('selection:cleared', () => {
      // グループを解除
      if (gridLinesGroup) {
        const objects = gridLinesGroup._objects;
        gridLinesGroup._restoreObjectsState();
        gridLinesGroup.getObjects().forEach((object) => {
          object.set({ left: object.left, top: object.top });
        });
        canvas.remove(gridLinesGroup);
        canvas.add(...objects);
        gridLinesGroup = null; // グループをリセット
      }
    });
    canvas.on('selection:updated', () => {
      const selectedObjects = canvas.getActiveObject();
      gridLinesGroup = groupGridLines(gridLinesData, selectedObjects, gridLinesGroup, canvas);
    });

    gridLinesData.push({ gridLines, maxSize: gridSize });
    canvas.add(...gridLines); 
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
        createGrid(fabricCanvas, 4, 100);
        setDrawingMode('');
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
      if (group && isActiveSelection(group)) {
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
