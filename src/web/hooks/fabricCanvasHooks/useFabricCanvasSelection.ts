import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { isActiveSelection } from '../../utils/validators';
import { groupGridLines } from '../../utils/gridLinesUtils';
import { ungroupObjects } from '../../utils/canvasUtils';

export const useFabricCanvasSelection = (
  fabricCanvas: fabric.Canvas | null,
  gridLinesDataRef: React.MutableRefObject<{ gridLines: fabric.Line[] }[]>,
) => {
  const gridLinesGroupRef = useRef<fabric.Group | null>(null);

  // gridLinesのグループを解除する関数
  const clearGroup = () => {
    if (gridLinesGroupRef.current && fabricCanvas) {
      ungroupObjects(gridLinesGroupRef.current, fabricCanvas);
      gridLinesGroupRef.current = null; // グループをリセット
    }
  };

  // selectionのスタイル設定とgridLinesのグループ化を制御する関数
  const handleSelection = (e: fabric.IEvent) => {
    if (!fabricCanvas) return;

    const selectedObjects = fabricCanvas.getActiveObject();
    console.log(selectedObjects)
     // 選択されたオブジェクトがactiveSelectionである場合
    if (selectedObjects && isActiveSelection(selectedObjects)) {
      selectedObjects.getObjects().forEach((obj: fabric.Object) => {
        if (obj instanceof fabric.Line) {
          fabricCanvas.discardActiveObject();
          return;
        }
      });
     
      selectedObjects.set({
        borderColor: 'red',
        cornerSize: 24,
        cornerStrokeColor: '#0064b6',
        lockRotation: true,
      });
      selectedObjects.setControlsVisibility({ mtr: false });
    } else if (selectedObjects) {
      // 外周のgridLinesをクリックした際、gridLinesをグループ化する
      gridLinesGroupRef.current = groupGridLines(gridLinesDataRef.current, selectedObjects, gridLinesGroupRef.current, fabricCanvas, e);
    }
  };

  // 'selection:updated'イベント時、実行される関数
  const selectionUpdated = (e: fabric.IEvent) => {
    clearGroup(); // グループを解除
    handleSelection(e);
  }
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  
  useEffect(() => {
    if (!fabricCanvas) return; 

    const startDrawing = (o: fabric.IEvent) => {
      if (o.e instanceof MouseEvent && o.e.ctrlKey && o.e.shiftKey) {
        isDragging = true;
        const pointer = fabricCanvas.getPointer(o.e);
        startX = pointer.x;
        startY = pointer.y;
      }
    };
    const finishDrawing = (o: fabric.IEvent) => {
      if (isDragging) {
        const pointer = fabricCanvas.getPointer(o.e);
        const endX = pointer.x;
        const endY = pointer.y;
        console.log(startX, endX)
        
        isDragging = false;
      }
    };

    fabricCanvas.on('selection:created', handleSelection);
    fabricCanvas.on('selection:updated', selectionUpdated);
    fabricCanvas.on('selection:cleared', clearGroup);
    fabricCanvas.on('mouse:down', startDrawing);
    fabricCanvas.on('mouse:up', finishDrawing);

    return () => {
      fabricCanvas.off('selection:created', handleSelection);
      fabricCanvas.off('selection:updated', selectionUpdated);
      fabricCanvas.off('selection:cleared', clearGroup);
      fabricCanvas.off('mouse:down', startDrawing);
      fabricCanvas.off('mouse:up', finishDrawing);
    };
  }, [fabricCanvas]);
}
