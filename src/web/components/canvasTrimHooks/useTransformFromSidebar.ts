import { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { STROKE_WIDTH } from './editCanvasConstants';
import { isRectPropsNumber } from '../../utils/validators';
import { isFabricRect, shiftObjects, resizeAndMoveObjects } from '../../utils/fabricEditCanvasUtils';
import { useGuideBarToolsContext } from '../sidebar/GuideBarToolsContext';
import { useSidebarStateContext } from '../sidebar/SidebarStateContext';
import { useHistoryContext } from '../../CanvasHistoryContext';


export const useTransformFromSidebar = (
  fabricCanvas: fabric.Canvas | null,
  fabricEditCanvas: fabric.Canvas | null,
) => {
  const {
		currentCanvasWidth, currentCanvasHeight, 
		trimRegionChanged, trimRegionWidth, trimRegionHeight
	} = useGuideBarToolsContext();
  const { resizeModeActive } = useSidebarStateContext();
	const { setIsSaveState } = useHistoryContext();

	const [ execFlag, setExecFlag ] = useState<boolean>(false);

	useEffect(() => {
		if (currentCanvasWidth !== trimRegionWidth || currentCanvasHeight !== trimRegionHeight) {
			if (resizeModeActive) {
				setExecFlag((flag: boolean) => !flag);
				setIsSaveState((flag: boolean) => !flag); 
			}
		}
	}, [trimRegionChanged]);

  useEffect(() => {
    if (!fabricCanvas || !fabricEditCanvas || !resizeModeActive) return;

		// キャンバスのオブジェクトリストからrectオブジェクトを取得
		const rect = fabricEditCanvas.getObjects()[0];
		if (!isFabricRect(rect) || !isRectPropsNumber(rect)) return;

		if (currentCanvasWidth !== trimRegionWidth) {
			const shiftAmountX = (trimRegionWidth - currentCanvasWidth) / 2;
			rect.scaleX = (trimRegionWidth + STROKE_WIDTH) / rect.width;
			shiftObjects(fabricCanvas, shiftAmountX, 0);
			rect.setCoords();
		}

		if (currentCanvasHeight !== trimRegionHeight) {
			const shiftAmountY = (trimRegionHeight - currentCanvasHeight) / 2;
			rect.scaleY = (trimRegionHeight + STROKE_WIDTH) / rect.height;
			shiftObjects(fabricCanvas, 0, shiftAmountY);
			rect.setCoords();
		}

		// 切り取りの実行及び切り取り領域内のオブジェクトを切り取り後のキャンバスに複製する
		resizeAndMoveObjects(fabricCanvas, rect, trimRegionWidth, trimRegionHeight);
      
    fabricEditCanvas.renderAll(); // キャンバスの再描画
  }, [fabricEditCanvas, execFlag]);

}
