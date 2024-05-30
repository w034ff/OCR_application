import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { isNumber } from '../../utils/validators';
import { useEditCanvasToolsContext } from './EditCanvasToolsContext';


export const useRotate90Canvas = (
  fabricCanvas: fabric.Canvas | null,
  fabricEditCanvas: fabric.Canvas | null,
  setResizeCompleted: React.Dispatch<React.SetStateAction<boolean>>,
  cleanupRef: React.RefObject<(() => void) | undefined>
) => {
  const { rotate90 } = useEditCanvasToolsContext();
  const previousRotateState = useRef<number>(rotate90);

  useEffect(() => {
    if(fabricCanvas && fabricEditCanvas) {
      if (rotate90 !== previousRotateState.current) {
        // すべてのオブジェクトを削除
        fabricEditCanvas.clear()

        // 回転の方向と回数を設定
        const rotationIncrement = rotate90 - previousRotateState.current;
        const angleIncrement = rotationIncrement * 90;
        const isClockwise = rotationIncrement > 0;

        // キャンバスのサイズを更新
        const width = fabricCanvas.getWidth();
        const height = fabricCanvas.getHeight();
        fabricCanvas.setWidth(height);
        fabricCanvas.setHeight(width);

        // キャンバス上の全オブジェクトに対して操作を実行
        fabricCanvas.forEachObject((obj: fabric.Object) => {
          if (isNumber(obj.left) && isNumber(obj.top) && isNumber(obj.angle)) {
            const newLeft = isClockwise ? height - obj.top : obj.top;
            const newTop = isClockwise ? obj.left : width - obj.left;
            obj.set({
              left: newLeft, top: newTop, angle: (obj.angle + angleIncrement) % 360
            }).setCoords(); // オブジェクトの位置を更新
          }
        });

        previousRotateState.current = rotate90;
        fabricCanvas.renderAll();
        setResizeCompleted((flag: boolean) => !flag);
      }

      return () => {
        if (cleanupRef.current) cleanupRef.current();
      };
    }
  }, [fabricEditCanvas, rotate90]);

}
