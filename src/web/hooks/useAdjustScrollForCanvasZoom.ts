import React, { useEffect } from 'react';
import { useCanvasToolsContext } from '../CanvasToolsContext';
import { useCanvasSimpleBarContext } from '../CanvasSimpleBarContext';
import { getNextScale } from '../utils/scaleUtils';
import { useScaleUpdateOnWheel } from './useScaleUpdateOnWheel';


export const useAdjustScrollForCanvasZoom = (
	canvasRef: React.RefObject<HTMLCanvasElement>,
	editCanvasRef:React.RefObject<HTMLCanvasElement>,
	InnercontainerRef: React.RefObject<HTMLDivElement>,
) => {
	const { scale, zoomScaleValue, scaleUpdateFlag } = useCanvasToolsContext();
	const { scrollElement, handleScrollbarToCenter } = useCanvasSimpleBarContext();

	// マウスホイールイベントでscaleを変更した際の処理をまとめたカスタムフック
	const { isWheelScaleUpdate, clientX, clientY, updateScaleOnWheel } = useScaleUpdateOnWheel();

	// マウスホイールでキャンパスの倍率を変更する処理
	useEffect(() => {
    const canvas = canvasRef.current;
    const editCanvas = editCanvasRef.current;
    const Innercontainer = InnercontainerRef.current;
    if (!canvas || !editCanvas || !Innercontainer || !scrollElement) return;

    if (scale <= 1) {
      Innercontainer.style.padding = `50% 60%`;
      handleScrollbarToCenter();
    } else {
      const rect = scrollElement.getBoundingClientRect();
      const mouseX = clientX - rect.left - canvas.width / 2;
      const mouseY = clientY - rect.top - canvas.height / 2;
      // 拡大・縮小前のマウスの位置（コンテナ基準）を計算
      const originalMouseX = mouseX + scrollElement.scrollLeft;
      const originalMouseY = mouseY + scrollElement.scrollTop;

      Innercontainer.style.padding = `${50 * scale}% ${60 * scale}%`;
      
      const newMouseX = originalMouseX *  zoomScaleValue;
      const newMouseY = originalMouseY * zoomScaleValue;
      scrollElement.scrollLeft = Math.round(newMouseX) - mouseX;
      scrollElement.scrollTop = Math.round(newMouseY) - mouseY;
    }
		
    canvas.style.transform = `scale(${scale})`;
    editCanvas.style.transform = `scale(${scale})`;
  }, [isWheelScaleUpdate]);

	useEffect(() => {
		const handleWheelEvent = (e: WheelEvent) => {
			e.preventDefault();
			if (e.deltaY < 0 && scale < 64.0) {
				updateScaleOnWheel(getNextScale(scale, 1), e);
			} else if (e.deltaY > 0 && scale > 0.1) {
				updateScaleOnWheel(getNextScale(scale, -1), e);
			}
		};

		if (InnercontainerRef.current){
			InnercontainerRef.current.addEventListener("wheel", handleWheelEvent);
		}

		return () => {
			if (InnercontainerRef.current) {
				InnercontainerRef.current.removeEventListener("wheel", handleWheelEvent);
			}
		};
	}, [scale]);
  

  // zoomScaleValueもしくはscaleUpdateFlagが変更された際、zoomとscrollの位置を調整
	useEffect(() => {
		const canvas = canvasRef.current;
		const editCanvas = editCanvasRef.current;
		const Innercontainer = InnercontainerRef.current;
		if (!canvas || !editCanvas || !Innercontainer || !scrollElement) return;
		if (scale <= 1) {
			Innercontainer.style.padding = `50% 60%`;
			handleScrollbarToCenter();
		} else {
			const PaddingX = scrollElement.clientWidth / 2 - canvas.width / 2;
			const PaddingY = scrollElement.clientHeight/ 2 - canvas.height / 2;
			const viewportCenterX = PaddingX + scrollElement.scrollLeft;
			const viewportCenterY = PaddingY + scrollElement.scrollTop;

			Innercontainer.style.padding = `${50 * scale}% ${60 * scale}%`;

			const scaledViewportCenterX = viewportCenterX * zoomScaleValue;
			const scaledViewportCenterY = viewportCenterY * zoomScaleValue;
			scrollElement.scrollLeft = Math.round(scaledViewportCenterX - PaddingX);
			scrollElement.scrollTop = Math.round(scaledViewportCenterY - PaddingY);
		}
		canvas.style.transform = `scale(${scale})`;
		editCanvas.style.transform = `scale(${scale})`;
	}, [scaleUpdateFlag]);
}
