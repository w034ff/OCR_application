import { useEffect } from 'react';
import { fabric } from 'fabric';
import { useSetHistoryStateContext } from '../../CanvasHistoryContext';

export const useFabricKeyboardEvents = (
  fabricCanvas: fabric.Canvas | null,
  gridLinesDataRef: React.MutableRefObject<{ gridLines: fabric.Line[] }[]>,
  isObjectActivatedRef: React.MutableRefObject<boolean>,
  prevCanvasStateRef: React.MutableRefObject<fabric.Object[] | null>
) => {
  const { toggleSaveState } = useSetHistoryStateContext();

  const removeLineFromGridData = (lineToRemove: fabric.Line) => {
    const { row, col, label, edgeType } = lineToRemove;
  
    // gridLinesDataRef から該当するラインを削除し、右側の列線のcolを更新
    gridLinesDataRef.current = gridLinesDataRef.current.map(data => ({
      gridLines: data.gridLines
        .filter(line => line !== lineToRemove)  // 削除対象の線分を削除
        .map(line => {
          // 右側にある列線のcol値を更新
          if (line.row === row && line.col > col && edgeType.includes('right') && line.edgeType.includes('right') && line.label === label) {
            line.set({ col: line.col - 1 });
            console.log('bbbbbbbbbbbb')
          }
          else if (line.row > row && line.col === col && edgeType.includes('top') && line.edgeType.includes('top') && line.label === label) {
            line.set({ row: line.row - 1 });
            console.log('aaaaaaaaaa')
          }
          return line;
        })
    }));
  };
  

  // 選択されたオブジェクトを削除する関数
  const handleDeleteObject = () => {
    if (!fabricCanvas) return;

    // 選択されたオブジェクトを取得（複数選択に対応）
    const selectedObjects = fabricCanvas.getActiveObjects();

    if (selectedObjects.length > 0) {
      selectedObjects.forEach(obj => {
        if (obj instanceof fabric.Group) {
          obj._restoreObjectsState();
          fabricCanvas.remove(obj); // グループ自体をキャンバスから削除
          obj.getObjects().forEach(groupedObj => {
            if (groupedObj instanceof fabric.Line) {
              console.log(groupedObj, obj)
              removeLineFromGridData(groupedObj); // gridLinesDataRef から該当するラインを削除
            }
            fabricCanvas.remove(groupedObj); // グループ内のオブジェクトをキャンバスから削除
          });
        } else if (obj instanceof fabric.Line) {
          removeLineFromGridData(obj); // gridLinesDataRef から該当するラインを削除
        }
        fabricCanvas.remove(obj); // オブジェクトをキャンバスから削除
      });

      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
      toggleSaveState();
    }
  };

  // キーボードのdelete, backspaceキーでオブジェクトを削除するイベントリスナー
  const handleKeyDown = (e: KeyboardEvent) => {
    if (fabricCanvas && (e.key === 'Delete' || e.key === 'Backspace')) {
      // キャンバスでオブジェクトがアクティブまたは操作されていることを示すフラグ。削除前のキャンバスの状態を保存するために必要となる。
      isObjectActivatedRef.current = true;
      // 現在のキャンバス状態（削除前のキャンバスの状態）を保存
      prevCanvasStateRef.current = fabricCanvas.toJSON().objects;
      handleDeleteObject();
    }
  };
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fabricCanvas]);
}
