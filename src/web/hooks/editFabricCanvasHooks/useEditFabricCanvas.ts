import { useUpdateEditCanvasSize } from './useUpdateEditCanvas';
import { useEditCanvasSetup } from './useEditCanvasSetup';
import { useTrimmingPreview } from './useTrimmingPreview';
import { useTrimmingPreviewFromSidebar } from './useTrimmingPreviewFromSidebar';
import { useTrimCanvas } from './useTrimCanvas';
import { useTransformCanvas } from './useTransformCanvas';
import { useTransformFromSidebar } from './useTransformFromSidebar';
import { useResizeFromModal } from './useResizeFromModal';
import { useFlipCanvas } from './useFlipCanvas';


export const useEditFabricCanvas = (
  fabricCanvas: fabric.Canvas | null,
  fabricEditCanvas: fabric.Canvas | null,
  canvasRef: React.RefObject<HTMLCanvasElement>,
) => {
  // drawing-canvasの大きさが変更された際、fabricEditCanvasの大きさを更新するカスタムフック
  useUpdateEditCanvasSize(fabricEditCanvas, canvasRef);

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
  // drawing-canvasを水平・垂直方向に反転させるカスタムフック
  useFlipCanvas(fabricCanvas);
};
