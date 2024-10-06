import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useSetHistoryStateContext } from '../../CanvasHistoryContext';
import { isNumber } from '../../utils/validators';

export const useFabrciCloneObjects = (
  fabricCanvas: fabric.Canvas | null,
  gridLinesDataRef: React.MutableRefObject<GridLinesData[]>,
  isObjectActivatedRef: React.MutableRefObject<boolean>,
  prevCanvasStateRef: React.MutableRefObject<fabric.Object[] | null>
) => {
  const { toggleSaveState } = useSetHistoryStateContext();
  
  const pasteObjectsRef = useRef<fabric.Object[] | null>(null);
  const pasteObjectHeightRef = useRef<number>(0);

  // 選択されたグリッドオブジェクトの下側に同じオブジェクトを複製・連結する関数
  const copyAndConcatGridObject = () => {
    if (!fabricCanvas) return;

    // 選択されたオブジェクトを取得
    const selectedObjects = fabricCanvas.getActiveObject();

    if (selectedObjects instanceof fabric.Group) {
      // グループをコピー（クローン）する
      selectedObjects?.clone((clonedGroup: fabric.Group) => {

        const cloneObjects = clonedGroup.getObjects();
        clonedGroup.destroy();

        
        if (selectedObjects.label !== 'concat' && selectedObjects.height) {
          pasteObjectHeightRef.current = selectedObjects.height;
          pasteObjectsRef.current = selectedObjects.getObjects();
          fabricCanvas.remove(selectedObjects); // グループ自体をキャンバスから削除

          // 初回連結時の処理
          pasteObjectsRef.current.forEach(obj => {
            if (isNumber(obj.top)) {
              console.log(obj.scaleY, selectedObjects.scaleY, clonedGroup.scaleY)
              obj.top += pasteObjectHeightRef.current -4;
              obj.test = obj.scaleY
              obj.setCoords(); // 座標を再計算
              fabricCanvas.remove(obj);
            }
          });
        } else if (selectedObjects.label === 'concat' && pasteObjectsRef.current) {
          fabricCanvas.remove(selectedObjects); // グループ自体をキャンバスから削除

          // 2回目以降の連結時の処理 (scaleYを考慮)
          pasteObjectsRef.current.forEach((obj, index) => {
            if (isNumber(obj.scaleY) && isNumber(cloneObjects[index].top)) {
              obj.scaleX = cloneObjects[index].scaleX;
              obj.scaleY = cloneObjects[index].scaleY;
              obj.left = cloneObjects[index].left;
              obj.top = cloneObjects[index].top + ((pasteObjectHeightRef.current - 4) * (obj.scaleY/obj.test));
            }
          });
        }

        if (!pasteObjectsRef.current) return;

        // 元のオブジェクトとクローンを新しいグループとして再グループ化
        const combinedGroup = new fabric.Group([...pasteObjectsRef.current, ...cloneObjects], {
          groupType: 'grid',
          label: 'concat',
          cornerSize: 24,
          cornerStrokeColor: '#0064b6',
          lockRotation: true,
          // hasControls: false, // falseにすると連結するオブジェクトの相対位置調整をしなくて済む
        });

        fabricCanvas.add(combinedGroup);
        fabricCanvas.setActiveObject(combinedGroup);
        toggleSaveState();
      });
    }
  };

  // キーボードのdelete, backspaceキーでオブジェクトを削除するイベントリスナー
  const handleKeyDown = (e: KeyboardEvent) => {
    if (fabricCanvas && (e.key === 'v' && e.ctrlKey)) {
      // キャンバスでオブジェクトがアクティブまたは操作されていることを示すフラグ。削除前のキャンバスの状態を保存するために必要となる。
      isObjectActivatedRef.current = true;
      // // 現在のキャンバス状態（削除前のキgroupャンバスの状態）を保存
      prevCanvasStateRef.current = fabricCanvas.toJSON().objects;
      copyAndConcatGridObject();
    }
  };

  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fabricCanvas]);
}
