import { useEffect } from 'react';
import { fabric } from 'fabric';
import { isNumber } from '../../utils/validators';
import { useSidebarStateContext } from '../sidebar/SidebarStateContext';


export const useResizeFromModal = (
  fabricCanvas: fabric.Canvas | null,
) => {
  const { resizeRatio, setResizeRatio } = useSidebarStateContext();
  // drawing-canvasの切り取りを実行する処理
  useEffect(() => {
    if (fabricCanvas && resizeRatio !== 1) {
			fabricCanvas.forEachObject((obj: fabric.Object) => {
				if(isNumber(obj.scaleX) && isNumber(obj.scaleY) && isNumber(obj.left) && isNumber(obj.top)) {
					obj.scaleX *= resizeRatio;
					obj.scaleY *= resizeRatio;
					obj.left *= resizeRatio;
					obj.top *= resizeRatio;
				}
				obj.setCoords(); // オブジェクトの座標情報を更新
			});

			// キャンバスのサイズを更新
			const width = fabricCanvas.getWidth();
			const height = fabricCanvas.getHeight();
			fabricCanvas.setWidth(width * resizeRatio);
  		fabricCanvas.setHeight(height * resizeRatio);

      setResizeRatio(1);
    }
  }, [resizeRatio]);

}
