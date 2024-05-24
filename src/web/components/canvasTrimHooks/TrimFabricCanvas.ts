import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { useEditCanvasSetup } from './useEditCanvasSetup';
import { useRectTrimPreview } from './RectTrimPreview';
import { useRectTrimPreviewFromSidebar } from './RectTrimPreviewFromSidebar';
import { useExecuteTrimming } from './ExecuteTrimming';
import { useExecuteResize } from './useExecuteResize';
import { useResizeFromSidebar } from './useResizeFromSidebar';
import { useResizeFromModal } from './useResizeFromModal';
import { useFlipCanvas } from './useFlipCanvas';


export const useTrimFabricCanvas = (
  fabricCanvas: fabric.Canvas | null,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  editCanvasRef:React.RefObject<HTMLCanvasElement>,
) => {
  const [fabricEditCanvas, setFabricEditCanvas] = useState<fabric.Canvas | null>(null)


  // trimModeActive, resizeModeActiveが変更された際、編集用オブジェクトを追加・削除するカスタムフック
  useEditCanvasSetup(fabricCanvas, canvasRef, fabricEditCanvas);
  // fabricEditCanvas上で切り取り領域を変更した際の処理（drawing-canvas外を切り取らないようにする処理）
  useRectTrimPreview(fabricEditCanvas);
  // サイドバーから切り取り領域を変更した際の処理（drawing-canvas外を切り取らないようにする処理）
  useRectTrimPreviewFromSidebar(fabricEditCanvas);
  // drawing-canvasの切り取りを実行するカスタムフック
  useExecuteTrimming(fabricCanvas, fabricEditCanvas);

  // リサイズ用オブジェクトを操作してリサイズを行うカスタムフック
  useExecuteResize(fabricCanvas, fabricEditCanvas);
  // サイドバーからリサイズするカスタムフック（テキストエリアがBlurした時にリサイズを行う）
  useResizeFromSidebar(fabricCanvas, fabricEditCanvas);
  // モーダルウィンドウからリサイズするカスタムフック（アスペクト比を維持しつつリサイズを行う）
  useResizeFromModal(fabricCanvas);
  // fabricCanvasを水平・垂直方向に反転させるカスタムフック
  useFlipCanvas(fabricCanvas);

  // 切り取り領域用のfabricキャンバスの初期化
  useEffect(() => {
    if (editCanvasRef.current && !fabricEditCanvas) {
      const newFabricCanvas = new fabric.Canvas(editCanvasRef.current);
      newFabricCanvas.upperCanvasEl.style.top = '-500px';
      newFabricCanvas.upperCanvasEl.style.left = '-500px';
      newFabricCanvas.setDimensions({width: 1800, height: 1600});
      newFabricCanvas.uniformScaling = false;
      newFabricCanvas.selection = false;
      setFabricEditCanvas(newFabricCanvas);
    }
  }, []);

  // drawing-canvasの大きさが変更された際、fabricEditCanvasの大きさを更新する
  useEffect(() => {
    if (canvasRef.current && fabricEditCanvas) {
      fabricEditCanvas.setWidth(canvasRef.current.width + 1000);
      fabricEditCanvas.setHeight(canvasRef.current.height + 1000);
    }
  }, [canvasRef.current?.width, canvasRef.current?.height]);

}
