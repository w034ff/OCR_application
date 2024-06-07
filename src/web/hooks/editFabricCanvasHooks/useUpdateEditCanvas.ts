import { useEffect } from 'react';
import { fabric } from 'fabric';

export const useUpdateEditCanvasSize = (
  fabricEditCanvas: fabric.Canvas | null,
  canvasRef: React.RefObject<HTMLCanvasElement>
) => {
	// drawing-canvasの大きさが変更された際、fabricEditCanvasの大きさを更新する
  useEffect(() => {
    if (canvasRef.current && fabricEditCanvas) {
      fabricEditCanvas.setWidth(canvasRef.current.width + 1000);
      fabricEditCanvas.setHeight(canvasRef.current.height + 1000);
    }
  }, [canvasRef.current?.width, canvasRef.current?.height, fabricEditCanvas]);
};
