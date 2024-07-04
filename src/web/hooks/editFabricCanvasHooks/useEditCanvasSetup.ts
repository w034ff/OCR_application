import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { useSidebarStateContext } from '../../components/SideBar/SidebarStateContext';
import { useEditCanvasToolsContext } from './EditCanvasToolsContext';
import { useRotate90Canvas } from './useRotate90Canvas';
import { createEditRectProps } from './createRectProps';
import { addRectToCanvas } from '../../utils/fabricEditCanvasUtils';
import { MIN_LEFT_TOP, STROKE_WIDTH } from './editCanvasConstants';


export const useEditCanvasSetup = (
  fabricCanvas: fabric.Canvas | null,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  fabricEditCanvas: fabric.Canvas | null,
) => {
  const { trimModeActive, resizeModeActive } = useSidebarStateContext();
  const { lockTrimAspectRatio, lockResizeAspectRatio } = useEditCanvasToolsContext();

  const [rotationCompleted, setRotationCompleted] = useState(false);
  const cleanupRef = useRef<() => void>(() => {});

  // fabricCanvasを90度回転させるカスタムフック
  useRotate90Canvas(fabricCanvas, fabricEditCanvas, setRotationCompleted, cleanupRef);

  
  // 縦横比を固定するにチェックがある際、アスペクト比を維持しながら切り取り領域を操作する
  useEffect(() => {
    if (fabricEditCanvas) {
      const shouldUniformScaling = (trimModeActive && lockTrimAspectRatio) || (resizeModeActive && lockResizeAspectRatio);
      // 現在の uniformScaling の状態と異なる場合のみ設定する
      if (fabricEditCanvas.uniformScaling !== shouldUniformScaling) {
        fabricEditCanvas.uniformScaling = shouldUniformScaling;
      }
    }
  }, [trimModeActive, resizeModeActive, lockTrimAspectRatio, lockResizeAspectRatio]);


  // fabricCanvasのオブジェクトをデアクティブ化し、edit-canvasにおけるupper-canvasのZ-Indexの値を調整
  useEffect(() => {
    if (!fabricCanvas) return;

    const upperEditCanvas = document.querySelector('.upper-edit-canvas');
    if (upperEditCanvas instanceof HTMLElement) {
      if (trimModeActive || resizeModeActive) {
        upperEditCanvas.style.zIndex = "10";
        fabricCanvas.discardActiveObject(); // アクティブなオブジェクトをデアクティブ化
        fabricCanvas.renderAll();
      } else {
        upperEditCanvas.style.zIndex = "-1";
      }
    }
  }, [trimModeActive, resizeModeActive]);
  

  // 背景と切り取り領域を追加・削除するfabricEditCanvasの初期化
  useEffect(() => {
    if (canvasRef.current && fabricEditCanvas) {
      const canvas = canvasRef.current;

      // すべてのオブジェクトを削除
      fabricEditCanvas.clear();

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
        const rectProps = createEditRectProps(MIN_LEFT_TOP, STROKE_WIDTH, canvas.width, canvas.height, 'trimModeActive');
        cleanupRef.current = addRectToCanvas(fabricEditCanvas, rectProps);
      }

      if (resizeModeActive) {
        // リサイズ領域を表す四角形の作成
        const rectProps = createEditRectProps(MIN_LEFT_TOP, STROKE_WIDTH, canvas.width, canvas.height, 'resizeModeActive');
        cleanupRef.current = addRectToCanvas(fabricEditCanvas, rectProps);
      }

      return () => {
        if (cleanupRef.current) cleanupRef.current();
      };
    }
  }, [trimModeActive, resizeModeActive]);


   // 90度回転後、fabricEditCanvasを初期化
   useEffect(() => {
    if (canvasRef.current && fabricEditCanvas) {
      const canvas = canvasRef.current;

      if (resizeModeActive) {
        // リサイズ領域を表す四角形の作成
        const rectProps = createEditRectProps(MIN_LEFT_TOP, STROKE_WIDTH, canvas.width, canvas.height, 'resizeModeActive');
        cleanupRef.current = addRectToCanvas(fabricEditCanvas, rectProps);
      }
    }
  }, [rotationCompleted]);

}
