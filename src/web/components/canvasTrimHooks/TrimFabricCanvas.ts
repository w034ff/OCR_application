import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { useEditCanvasSetup } from './useEditCanvasSetup';
import { useTrimmingPreview } from './useTrimmingPreview';
import { useTrimmingPreviewFromSidebar } from './useTrimmingPreviewFromSidebar';
import { useTrimCanvas } from './useTrimCanvas';
import { useTransformCanvas } from './useTransformCanvas';
import { useTransformFromSidebar } from './useTransformFromSidebar';
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
  useTrimmingPreview(fabricEditCanvas);
  // サイドバーから切り取り領域を変更した際の処理（drawing-canvas外を切り取らないようにする処理）
  useTrimmingPreviewFromSidebar(fabricEditCanvas);
  // drawing-canvasの切り取りを実行するカスタムフック
  useTrimCanvas(fabricCanvas, fabricEditCanvas);

  // リサイズ用オブジェクトを操作してリサイズを行うカスタムフック
  useTransformCanvas(fabricCanvas, fabricEditCanvas);
  // サイドバーから拡張・切り取りするカスタムフック（テキストエリアをBlurした時、キャンパスを変形する）
  useTransformFromSidebar(fabricCanvas, fabricEditCanvas);
  // モーダルウィンドウからリサイズするカスタムフック（アスペクト比を維持しつつリサイズする）
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
