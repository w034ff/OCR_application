import { useEffect } from 'react';
import { fabric } from 'fabric';
import { isNumber } from '../../utils/validators';
import { CANVAS_MAX_SIZE } from '../../utils/editCanvasConstants';
import { useResizeCanvasContext } from '../../components/ModalWindow/ResizeCanvasContext';

// スケーリングファクターを計算する関数
const calculateScaleFactor = (size: number) => (CANVAS_MAX_SIZE / size);

export const useResizeFromModal = (
  fabricCanvas: fabric.Canvas | null,
) => {
  const { resizeRatio } = useResizeCanvasContext();
  // drawing-canvasのリサイズを実行する処理
  useEffect(() => {
    if (fabricCanvas) {
			// キャンバスのサイズを計算
			const resizedWidth = fabricCanvas.getWidth() * resizeRatio.ratio;
			const resizedHeight = fabricCanvas.getHeight() * resizeRatio.ratio;

			// 2000pxを超える場合の処理
			let scaleFactor = 1;
			if (resizedWidth > CANVAS_MAX_SIZE || resizedHeight > CANVAS_MAX_SIZE) {
				if (resizedWidth > resizedHeight) {
					scaleFactor = calculateScaleFactor(resizedWidth);
					fabricCanvas.setWidth(CANVAS_MAX_SIZE);
					fabricCanvas.setHeight(resizedHeight * scaleFactor);
				} else {
					scaleFactor = calculateScaleFactor(resizedHeight);
					fabricCanvas.setWidth(resizedWidth * scaleFactor);
  				fabricCanvas.setHeight(CANVAS_MAX_SIZE);
				}
			} else {
				fabricCanvas.setWidth(resizedWidth);
  			fabricCanvas.setHeight(resizedHeight);
			}

			// キャンバス上のすべてのオブジェクトをスケール
			fabricCanvas.forEachObject((obj: fabric.Object) => {
				if (isNumber(obj.scaleX) && isNumber(obj.scaleY) && isNumber(obj.left) && isNumber(obj.top)) {
					obj.scaleX *= scaleFactor * resizeRatio.ratio;
					obj.scaleY *= scaleFactor * resizeRatio.ratio;
					obj.left *= scaleFactor * resizeRatio.ratio;
					obj.top *= scaleFactor * resizeRatio.ratio;
				}
				obj.setCoords(); // オブジェクトの座標情報を更新
			});
    }
  }, [resizeRatio.isResize]);
}
