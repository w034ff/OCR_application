import React, { useEffect } from 'react';
import { fabric } from 'fabric';
import { useSidebarStateContext } from '../sidebar/SidebarStateContext';


export const useCanvasTrimPreviewSetup = (
  fabricCanvas: fabric.Canvas | null,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  fabricEditCanvas: fabric.Canvas | null,
  MIN_LEFT_TOP: number,
  STROKE_WIDTH: number,
) => {
  const { trimDetailsVisible } = useSidebarStateContext();

  // fabricCanvasのオブジェクトをデアクティブ化
  useEffect(() => {
    if (!fabricCanvas) return;
      if (trimDetailsVisible) {
        fabricCanvas.discardActiveObject(); // アクティブなオブジェクトをデアクティブ化
      } 
      fabricCanvas.renderAll();
  }, [trimDetailsVisible]);

  // 背景と切り取り領域を追加・削除するfabricEditCanvasの初期化
  useEffect(() => {
    if (canvasRef.current && fabricEditCanvas) {

      const canvas = canvasRef.current;
      if (trimDetailsVisible) {
        // 背景色用の四角形を作成
        const backgroundRect = new fabric.Rect({
          left: 0,
          top: 0,
          width: fabricEditCanvas.width,
          height: fabricEditCanvas.height,
          fill: 'rgba(55, 55, 55, 0.6)',
          selectable: false,
          evented: false,
          hasControls: false,
          hasBorders: false,
        });
        // 切り取り領域を表す四角形の作成
        const rect = new fabric.Rect({
          left: MIN_LEFT_TOP,
          top: MIN_LEFT_TOP,
          stroke: 'red',
          strokeWidth: STROKE_WIDTH,
          strokeUniform: true,
          fill: 'rgba(255, 255, 255, 0.4)',
          width: canvas.width + STROKE_WIDTH,
          height: canvas.height + STROKE_WIDTH, 
          lockUniScaling: true,
          hasControls: true,
          hasBorders: true,
          borderColor: 'white',
          selectable: true,
          lockRotation: true,
          cornerColor: '#f0f2f3',
          cornerSize: 18,
          transparentCorners: false,
          cornerStyle: 'circle',
          cornerStrokeColor: '#3c3f46',
        });
        // 回転用コントロールを非表示
        rect.setControlsVisibility({ mtr: false });

        fabricEditCanvas.add(backgroundRect);
        fabricEditCanvas.add(rect);
        fabricEditCanvas.setActiveObject(rect);

        const handleSelectionCleared = (e: fabric.IEvent) => {
          fabricEditCanvas.setActiveObject(rect);
        };
  
        fabricEditCanvas.on('selection:cleared', handleSelectionCleared);
  
        return () => {
          fabricEditCanvas.off('selection:cleared', handleSelectionCleared);
        };
      } else {
        fabricEditCanvas.forEachObject((obj: fabric.Object) => {
          fabricEditCanvas.remove(obj); // 条件に合致するオブジェクトを削除
        });
      }
      
      fabricEditCanvas.renderAll();
    }
  }, [trimDetailsVisible]);
}
