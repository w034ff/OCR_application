import { useEffect } from 'react';
import { fabric } from 'fabric';
import { isNumber } from '../../utils/validators';
import { useResizeCanvasContext } from '../../components/ModalWindow/ResizeCanvasContext';


export const useResizeFromModal = (
  fabricCanvas: fabric.Canvas | null,
) => {
  const { resizeRatio } = useResizeCanvasContext();
  // drawing-canvasの切り取りを実行する処理
  useEffect(() => {
    if (fabricCanvas) {
			fabricCanvas.forEachObject((obj: fabric.Object) => {
				if(isNumber(obj.scaleX) && isNumber(obj.scaleY) && isNumber(obj.left) && isNumber(obj.top)) {
					obj.scaleX *= resizeRatio.ratio;
					obj.scaleY *= resizeRatio.ratio;
					obj.left *= resizeRatio.ratio;
					obj.top *= resizeRatio.ratio;
				}
				obj.setCoords(); // オブジェクトの座標情報を更新
			});

			// キャンバスのサイズを更新
			const width = fabricCanvas.getWidth();
			const height = fabricCanvas.getHeight();
			fabricCanvas.setWidth(width * resizeRatio.ratio);
  		fabricCanvas.setHeight(height * resizeRatio.ratio);
    }
  }, [resizeRatio.isResize]);
}
