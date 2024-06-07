import { useEffect, useState } from 'react';
import { fabric } from 'fabric';

export const useInitializeEditCanvas = (editCanvasRef: React.RefObject<HTMLCanvasElement>) => {
	const [fabricEditCanvas, setFabricEditCanvas] = useState<fabric.Canvas | null>(null);

	// 切り取り領域用のfabricキャンバスの初期化
	useEffect(() => {
		if (editCanvasRef.current && !fabricEditCanvas) {
			const newFabricCanvas = new fabric.Canvas(editCanvasRef.current);
			newFabricCanvas.upperCanvasEl.style.top = '-500px';
			newFabricCanvas.upperCanvasEl.style.left = '-500px';
			newFabricCanvas.setDimensions({ width: 1800, height: 1600 });
			newFabricCanvas.uniformScaling = false;
			newFabricCanvas.selection = false;
			setFabricEditCanvas(newFabricCanvas);
		}
	}, [editCanvasRef]);

	return fabricEditCanvas;
};
