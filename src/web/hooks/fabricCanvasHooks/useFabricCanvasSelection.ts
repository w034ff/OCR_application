import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { isActiveSelection } from '../../utils/validators';
import { groupGridLines } from '../../utils/gridLinesUtils';
import { ungroupObjects } from '../../utils/canvasUtils';

export const useFabricCanvasSelection = (
  fabricCanvas: fabric.Canvas | null,
  gridLinesDataRef: React.MutableRefObject<GridLinesData[]>,
) => {
  const gridLinesGroupRef = useRef<fabric.Group | null>(null);
  const isGroupScaledRef = useRef<boolean>(false);

  // gridLinesのグループを解除する関数
  const clearGroup = () => {
    if (gridLinesGroupRef.current && fabricCanvas && !isGroupScaledRef.current) {
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

  const scalingGroup = (e: fabric.IEvent) => {
    const group = e.target;
    if (group instanceof fabric.Group && group.groupType === 'grid') {
      isGroupScaledRef.current = true;
    }
  }

  // スケーリング後にグリッドオブジェクトを再グループ化する関数
  const regroupGridObjects = (e: fabric.IEvent) => {
    const group = e.target;
    if (!(group instanceof fabric.Group) || !fabricCanvas || !isGroupScaledRef.current) return;
    
    // グループ内のオブジェクトを取得して、グループを解除
    const gridObjects = group.getObjects();
    group._restoreObjectsState(); // グループ解除
    fabricCanvas.remove(group); // グループをキャンバスから削除

    // グループを再作成してキャンバスに追加
    const newGroup = new fabric.Group(gridObjects, {
      label: group.label,
      groupType: group.groupType,
      cornerSize: 24,
      cornerStrokeColor: '#0064b6',
      lockRotation: true,
    });

    newGroup.setControlsVisibility({ mtr: false });
    fabricCanvas.add(newGroup);
    fabricCanvas.setActiveObject(newGroup);

    if (gridLinesGroupRef.current) {
      gridLinesGroupRef.current = newGroup;
    }

    isGroupScaledRef.current = false; // スケールフラグをリセット
  };
  
  useEffect(() => {
    if (!fabricCanvas) return; 

    fabricCanvas.on('selection:created', handleSelection);
    fabricCanvas.on('selection:updated', selectionUpdated);
    fabricCanvas.on('selection:cleared', clearGroup);
    fabricCanvas.on('mouse:up', regroupGridObjects);
    fabricCanvas.on('object:scaling', scalingGroup);

    return () => {
      fabricCanvas.off('selection:created', handleSelection);
      fabricCanvas.off('selection:updated', selectionUpdated);
      fabricCanvas.off('selection:cleared', clearGroup);
      fabricCanvas.off('mouse:up', regroupGridObjects);
      fabricCanvas.off('object:scaling', scalingGroup);
    };
  }, [fabricCanvas]);
}
