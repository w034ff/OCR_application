import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { useCanvasTrimPreviewSetup } from './CanvasTrimPreviewSetup';
import { useRectTrimPreview } from './RectTrimPreview';
import { useRectTrimPreviewFromSidebar } from './RectTrimPreviewFromSidebar';
import { useExecuteTrimming } from './ExecuteTrimming';
import { useGuideBarToolsContext } from '../sidebar/GuideBarToolsContext';


const MIN_LEFT_TOP = 498;
// キャンバスの左端からRectオブジェクトの内側のエッジまでの最小距離を示すオフセット
const EDGE_OFFSET = 500;
// Rectオブジェクトのストロークの太さ。Rectオブジェクトのサイズ計算において、枠線の太さも含まれるため注意が必要
const STROKE_WIDTH = 2;


export const useTrimFabricCanvas = (
  fabricCanvas: fabric.Canvas | null,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  editCanvasRef:React.RefObject<HTMLCanvasElement>,
) => {
  const { rotate90 } = useGuideBarToolsContext(); 
  const [fabricEditCanvas, setFabricEditCanvas] = useState<fabric.Canvas | null>(null)

  // trimDetailsVisibleが変更された際、fabricCanvasのオブジェクトをデアクティブ化し、背景と切り取り領域を追加・削除するカスタムフック
  useCanvasTrimPreviewSetup(fabricCanvas, canvasRef, fabricEditCanvas, MIN_LEFT_TOP, STROKE_WIDTH);
  // fabricEditCanvas上で切り取り領域を変更した際の処理（drawing-canvas外を切り取らないようにする処理）
  useRectTrimPreview(fabricEditCanvas, MIN_LEFT_TOP, EDGE_OFFSET, STROKE_WIDTH);
  // サイドバーから切り取り領域を変更した際の処理（drawing-canvas外を切り取らないようにする処理）
  useRectTrimPreviewFromSidebar(fabricEditCanvas, MIN_LEFT_TOP, EDGE_OFFSET, STROKE_WIDTH);
  // drawing-canvasの切り取りを実行するカスタムフック
  useExecuteTrimming(fabricCanvas, fabricEditCanvas, MIN_LEFT_TOP, EDGE_OFFSET);

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


  useEffect(() => {
    if(fabricCanvas) {
      const width = fabricCanvas.getWidth();
      const height = fabricCanvas.getHeight();

      // キャンバスのサイズを回転後の状態に合わせて更新
      fabricCanvas.setWidth(height);
      fabricCanvas.setHeight(width);

      // キャンバス上の全オブジェクトに対して操作を実行
      fabricCanvas.forEachObject((obj) => {
        // オブジェクトの中心点を基に90度回転
        obj.set({
          left: obj.top,
          top: width - obj.left - obj.width * obj.scaleX,
          angle: obj.angle - 90,
        }).setCoords(); // 座標の更新を確実に適用
      });

      

      // キャンバスの再描画
      fabricCanvas.renderAll();
    }
  }, [rotate90]);

}
