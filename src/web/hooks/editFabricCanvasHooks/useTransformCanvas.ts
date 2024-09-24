import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useSetHistoryStateContext } from '../../CanvasHistoryContext';
import { useEditCanvasToolsContext } from './EditCanvasToolsContext';
import { useSidebarStateContext } from '../../components/SideBar/SidebarStateContext';
import { isNumber, isRectPropsNumber } from '../../utils/validators';
import { limitMaxSize, isFabricRect, shiftObjects, resizeAndMoveObjects } from '../../utils/fabricEditCanvasUtils';
import { MIN_LEFT_TOP, STROKE_WIDTH, CANVAS_MAX_SIZE } from '../../utils/editCanvasConstants';

export const useTransformCanvas = (
	fabricCanvas: fabric.Canvas | null,
  fabricEditCanvas: fabric.Canvas | null
) => {
	const { toggleSaveState } = useSetHistoryStateContext();
  const { setTrimRegionWidth, setTrimRegionHeight } = useEditCanvasToolsContext();
  const { resizeModeActive } = useSidebarStateContext();

	const initialScalingFlag = useRef<boolean>(false);
	

	const handleFabricRectScaling = (o: fabric.IEvent) => {
		const rect = o.target;
		if (!(rect instanceof fabric.Rect)) return;

		if (!initialScalingFlag.current) {
			toggleSaveState();
			initialScalingFlag.current = true;
		}

		if (isNumber(rect.width) && isNumber(rect.scaleX) && isNumber(rect.height) && isNumber(rect.scaleY)) {
			const currentWidth = Math.round((rect.width - STROKE_WIDTH) * rect.scaleX);
    	const currentHeight = Math.round((rect.height - STROKE_WIDTH) * rect.scaleY);

			// トリミング領域の幅と高さを設定
			setTrimRegionWidth(limitMaxSize(currentWidth));
			setTrimRegionHeight(limitMaxSize(currentHeight));

			// キャンバス最大サイズを超えないようにスケールを調整
			const maxScaleX = CANVAS_MAX_SIZE / (rect.width - STROKE_WIDTH);
			const maxScaleY = CANVAS_MAX_SIZE / (rect.height - STROKE_WIDTH);

			// スケールの制限
			rect.scaleX = Math.min(rect.scaleX, maxScaleX);
			rect.scaleY = Math.min(rect.scaleY, maxScaleY);

			// rectオブジェクトのスケールを再設定
			rect.set({ scaleX: rect.scaleX , scaleY: rect.scaleY })
		}
	};

	const finishDrawing = () => {
		if (fabricCanvas && fabricEditCanvas) {
			const rect = fabricEditCanvas.getObjects()[0];
			if (!isFabricRect(rect) || !isRectPropsNumber(rect)) return;

			const shiftX = rect.left !== MIN_LEFT_TOP ? MIN_LEFT_TOP - rect.left : 0;
			const shiftY = rect.top !== MIN_LEFT_TOP ? MIN_LEFT_TOP - rect.top : 0;
			rect.set({ left: MIN_LEFT_TOP, top: MIN_LEFT_TOP });
			shiftObjects(fabricCanvas, shiftX, shiftY);

			fabricCanvas.renderOnAddRemove = false;

			// 切り取りの実行及び切り取り領域内のオブジェクトを切り取り後のキャンバスに複製する
			resizeAndMoveObjects(
				fabricCanvas, rect,
				Math.round((rect.width - STROKE_WIDTH) * rect.scaleX),
				Math.round((rect.height - STROKE_WIDTH) * rect.scaleY)
			)
			
			fabricCanvas.renderAll();
			fabricCanvas.renderOnAddRemove = true;
			initialScalingFlag.current = false;
		}
	};
  
  useEffect(() => {
    if (!fabricEditCanvas || !resizeModeActive) return;
    
		fabricEditCanvas.on('object:scaling', handleFabricRectScaling);
		fabricEditCanvas.on('mouse:up', finishDrawing);

    return () => {
      fabricEditCanvas.off('object:scaling', handleFabricRectScaling);
			fabricEditCanvas.off('mouse:up', finishDrawing);
    }
  }, [fabricEditCanvas, resizeModeActive]);
}
