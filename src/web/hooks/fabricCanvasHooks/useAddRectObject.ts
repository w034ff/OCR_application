import { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { addRectProps } from '../../utils/createRectProps';
import { isNumber } from '../../utils/validators';
import { handleScrollbarClick } from '../../utils/clickEventUtils';
import { useCanvasToolsContext } from '../../CanvasToolsContext';
import { useSetHistoryStateContext } from '../../CanvasHistoryContext';
import { useSidebarStateContext } from '../../components/SideBar/SidebarStateContext';

export const useAddRectObject = (fabricCanvas: fabric.Canvas | null) => {
  const { scale } = useCanvasToolsContext();
  const { toggleSaveState } = useSetHistoryStateContext();
  const { drawingMode, setDrawingMode } = useSidebarStateContext();
  const [tempRect, setTempRect] = useState<fabric.Rect | null>(null);

  // ユーザーがクリックした位置を基に新しい四角形オブジェクトを作成し、キャンバスに追加する関数
  const startDrawing = (o: fabric.IEvent) => {
    if (drawingMode === 'rect' && fabricCanvas && !fabricCanvas.getActiveObject() &&
        o.e instanceof MouseEvent && !handleScrollbarClick(o.e)) {
      fabricCanvas.selection = false;
      const pointer = fabricCanvas.getPointer(o.e);
      const rect = new fabric.Rect(addRectProps(pointer, scale));
      setTempRect(rect);
      rect.setControlsVisibility({ mtr: false });
      fabricCanvas.add(rect);
      toggleSaveState();
    }
  };

  // ユーザーがマウスをドラッグしている間、四角形のサイズと位置を動的に更新する関数
  const keepDrawing = (o: fabric.IEvent) => {
    if (!fabricCanvas || !tempRect || !isNumber(tempRect.left) || !isNumber(tempRect.top)) return;

    const pointer = fabricCanvas.getPointer(o.e);
    // スケーリングされたキャンバスに対するポインタの相対座標を計算
    const xChange = (pointer.x - tempRect.left) * scale;
    const yChange = (pointer.y  - tempRect.top) * scale;

    const width = Math.abs(xChange);
    const height = Math.abs(yChange);
    const originX = (xChange > 0) ? 'left' : 'right';
    const originY = (yChange > 0) ? 'top' : 'bottom';

    // 四角形のプロパティを更新
    tempRect.set({ width: width, height: height, originX: originX, originY: originY });
    fabricCanvas.renderAll();
  };

  // 四角形の描画を終了し、最終的なサイズを決定する関数
  const finishDrawing = () => {
    if (tempRect && fabricCanvas && isNumber(tempRect.width) && isNumber(tempRect.height)) {
      // 四角形の幅と高さの最低値を75px以上にする
      const width = Math.max(75 * scale, tempRect.width);
      const height = Math.max(75 * scale, tempRect.height);
      tempRect.set({ width: width, height: height });
      fabricCanvas.setActiveObject(tempRect);
      fabricCanvas.renderAll();
      setTempRect(null);
      setDrawingMode(''); // 描画モード(rect)をリセットする
    }
  };

  
  useEffect(() => {
    if (!fabricCanvas) return; 

    fabricCanvas.on('mouse:down', startDrawing);
    fabricCanvas.on('mouse:move', keepDrawing);
    fabricCanvas.on('mouse:up', finishDrawing);

    return () => {
      fabricCanvas.off('mouse:down', startDrawing);
      fabricCanvas.off('mouse:move', keepDrawing);
      fabricCanvas.off('mouse:up', finishDrawing);
    };
  }, [fabricCanvas, scale, tempRect, drawingMode]);
}
