import React, { useEffect } from 'react';
import { fabric } from 'fabric';
import { useSidebarStateContext } from '../sidebar/SidebarStateContext';


export const useEditCanvasSetup = (
  fabricCanvas: fabric.Canvas | null,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  fabricEditCanvas: fabric.Canvas | null,
  MIN_LEFT_TOP: number,
  STROKE_WIDTH: number,
) => {
  const { trimModeActive, resizeModeActive } = useSidebarStateContext();

  // fabricCanvasのオブジェクトをデアクティブ化
  useEffect(() => {
    if (!fabricCanvas) return;
      if (trimModeActive || resizeModeActive) {
        fabricCanvas.discardActiveObject(); // アクティブなオブジェクトをデアクティブ化
      } 
      fabricCanvas.renderAll();
  }, [trimModeActive, resizeModeActive]);

  // 背景と切り取り領域を追加・削除するfabricEditCanvasの初期化
  useEffect(() => {
    if (canvasRef.current && fabricEditCanvas) {
      const canvas = canvasRef.current;

      // すべてのオブジェクトを削除
      fabricEditCanvas.forEachObject((obj: fabric.Object) => {
        fabricEditCanvas.remove(obj);
      });

      if (trimModeActive) {
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

        fabricEditCanvas.add(backgroundRect);

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
        rect.setControlsVisibility({ mtr: false });

        fabricEditCanvas.add(rect);
        fabricEditCanvas.setActiveObject(rect);

        const handleSelectionCleared = () => {
          fabricEditCanvas.setActiveObject(rect);
        };
        fabricEditCanvas.on('selection:cleared', handleSelectionCleared);

        return () => {
          fabricEditCanvas.off('selection:cleared', handleSelectionCleared);
        };
      }

      if (resizeModeActive) {
        // 切り取り領域を表す四角形の作成
        const rect = new fabric.Rect({
          left: MIN_LEFT_TOP,
          top: MIN_LEFT_TOP,
          stroke: 'black',
          strokeWidth: STROKE_WIDTH,
          strokeUniform: true,
          fill: 'transparent',
          width: canvas.width + STROKE_WIDTH,
          height: canvas.height + STROKE_WIDTH,
          lockUniScaling: true,
          hasControls: true,
          lockRotation: true,
          cornerColor: '#f0f2f3',
          cornerSize: 20,
          transparentCorners: false,
          cornerStrokeColor: '#3c3f46',
          lockScalingX: false,
          lockScalingY: false,
          lockMovementX: true,
          lockMovementY: true,
          hoverCursor: 'default',
        });
        rect.setControlsVisibility({ mtr: false });

        fabricEditCanvas.add(rect);
        fabricEditCanvas.setActiveObject(rect);

        const handleSelectionCleared = () => {
          fabricEditCanvas.setActiveObject(rect);
        };
        fabricEditCanvas.on('selection:cleared', handleSelectionCleared);

        return () => {
          fabricEditCanvas.off('selection:cleared', handleSelectionCleared);
        };
      }
    }
  }, [trimModeActive, resizeModeActive]);

}
