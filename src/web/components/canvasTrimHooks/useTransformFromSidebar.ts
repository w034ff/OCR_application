import { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { STROKE_WIDTH } from './editCanvasConstants';
import { isNumber } from '../../utils/validators';
import { isFabricRect, shiftObjects, resizeAndMoveObjects } from '../../utils/fabricEditCanvasUtils';
import { useEditCanvasToolsContext } from './EditCanvasToolsContext';
import { useSidebarStateContext } from '../sidebar/SidebarStateContext';
import { useHistoryContext } from '../../CanvasHistoryContext';


export const useTransformFromSidebar = (
  fabricCanvas: fabric.Canvas | null,
  fabricEditCanvas: fabric.Canvas | null,
) => {
  const {
		currentCanvasWidth, currentCanvasHeight, 
		trimRegionChanged, trimRegionWidth, trimRegionHeight
	} = useEditCanvasToolsContext();
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
		if (!isFabricRect(rect) || !isNumber(rect.width) || !isNumber(rect.height)) return;

		const shiftX = currentCanvasWidth !== trimRegionWidth ? (trimRegionWidth - currentCanvasWidth) / 2 : 0;
		const shiftY = currentCanvasHeight !== trimRegionHeight ?  (trimRegionHeight - currentCanvasHeight) / 2 : 0;
		rect.set({
			scaleX: (trimRegionWidth + STROKE_WIDTH) / rect.width,
			scaleY: (trimRegionHeight + STROKE_WIDTH) / rect.height
		})
		shiftObjects(fabricCanvas, shiftX, shiftY);

		fabricCanvas.renderOnAddRemove = false;

		// 切り取りの実行及び切り取り領域内のオブジェクトを切り取り後のキャンバスに複製する
		resizeAndMoveObjects(fabricCanvas, rect, trimRegionWidth, trimRegionHeight);
      
    fabricEditCanvas.renderAll(); // キャンバスの再描画
		fabricCanvas.renderOnAddRemove = true;
  }, [fabricEditCanvas, execFlag]);

}
