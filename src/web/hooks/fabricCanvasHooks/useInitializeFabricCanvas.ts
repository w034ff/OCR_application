import { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { useUpdateEditCanvasSize } from '../editFabricCanvasHooks/useUpdateEditCanvas';

export const useInitializeFabricCanvas = (
	canvasRef: React.RefObject<HTMLCanvasElement>,
	editCanvasRef: React.RefObject<HTMLCanvasElement>
) => {
	const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
	const [fabricEditCanvas, setFabricEditCanvas] = useState<fabric.Canvas | null>(null);

	// drawing-canvasの大きさが変更された際、fabricEditCanvasの大きさを更新するカスタムフック
  useUpdateEditCanvasSize(fabricEditCanvas, canvasRef);

	// 描画用fabricキャンバスの初期化
	useEffect(() => {
		if (canvasRef.current && !fabricCanvas) {
			const newFabricCanvas = new fabric.Canvas(canvasRef.current, {
				uniformScaling: false,
				selection: true,
			});
			setFabricCanvas(newFabricCanvas);
		}
	}, [canvasRef]);

	// 切り取り領域用fabricキャンバスの初期化
	useEffect(() => {
		if (editCanvasRef.current && !fabricEditCanvas) {
			const newFabricCanvas = new fabric.Canvas(editCanvasRef.current, {
				uniformScaling: false,
				selection: false
			});
			newFabricCanvas.upperCanvasEl.style.top = '-500px';
			newFabricCanvas.upperCanvasEl.style.left = '-500px';
			newFabricCanvas.upperCanvasEl.classList.remove('upper-canvas');
			newFabricCanvas.upperCanvasEl.classList.add('upper-edit-canvas');
			newFabricCanvas.setDimensions({ width: 1800, height: 1600 });
			setFabricEditCanvas(newFabricCanvas);
		}
	}, [editCanvasRef]);

	return { fabricCanvas, fabricEditCanvas };
}
