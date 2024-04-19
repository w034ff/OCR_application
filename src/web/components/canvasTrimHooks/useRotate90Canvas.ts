import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { isNumber } from '../../utils/IsNumber';
import { useGuideBarToolsContext } from '../sidebar/GuideBarToolsContext';


export const useRotate90Canvas = (
  fabricCanvas: fabric.Canvas | null,
) => {
  const { rotate90 } = useGuideBarToolsContext();
  const previousRotateState = useRef<number>(rotate90);

  useEffect(() => {
    if(fabricCanvas) {
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
    }
  }, [rotate90]);

}
