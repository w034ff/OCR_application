import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { isNumber } from '../../utils/validators';
import { useGuideBarToolsContext } from '../sidebar/GuideBarToolsContext';


// 角度の正規化処理
const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;

// fabricオブジェクトの反転処理
const updateObjectForFlip = (obj: fabric.Object, isVerticalFlip: boolean, canvasWidth: number, canvasHeight: number) => {
  if (isNumber(obj.left) && isNumber(obj.top) && isNumber(obj.angle)) {
    const widthScaled = obj.getScaledWidth();
    const heightScaled = obj.getScaledHeight();
    const normalizedAngle = normalizeAngle(obj.angle);
    
    // 基本的なフリップ処理
    let newLeft = isVerticalFlip ? obj.left + widthScaled : canvasWidth - obj.left;
    let newTop = isVerticalFlip ? canvasHeight - obj.top : obj.top + heightScaled;

    // 角度による位置調整
    switch (normalizedAngle) {
      case 90:
        isVerticalFlip ? newLeft = obj.left - heightScaled : newTop = obj.top + widthScaled;
        break;
      case 180:
        isVerticalFlip ? newLeft = obj.left - widthScaled : newTop = obj.top - heightScaled;
        break;
      case 270:
        isVerticalFlip ? newLeft = obj.left + heightScaled : newTop = obj.top - widthScaled;
        break;
    }

    obj.set({
      left: newLeft, top: newTop, angle: (obj.angle + 180) % 360
    }).setCoords();
  }
};


export const useFlipCanvas = (
  fabricCanvas: fabric.Canvas | null,
) => {
  const { flipState } = useGuideBarToolsContext();
  const previousFlipState = useRef<number>(flipState);

  useEffect(() => {
    if(fabricCanvas) {
      // 反転の方向と判定
      const flipIncrement = flipState - previousFlipState.current;
      const isVerticalFlip = flipIncrement > 0;

      const width = fabricCanvas.getWidth();
      const height = fabricCanvas.getHeight();

      // キャンバス上の全オブジェクトに対して操作を実行
      fabricCanvas.forEachObject((obj: fabric.Object) => {
        updateObjectForFlip(obj, isVerticalFlip, width, height)
      });

      previousFlipState.current = flipState; 
      fabricCanvas.renderAll();
    }
  }, [flipState]);
}
