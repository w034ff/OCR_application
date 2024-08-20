import { useRef } from 'react';
import { useSidebarStateContext } from '../SideBar/SidebarStateContext';
import { useEventRegister } from '../../hooks/fabricCanvasHooks/useEventRegister';
import { useInitializeFabricCanvas } from '../../hooks/fabricCanvasHooks/useInitializeFabricCanvas';
import { useCanvasMouseEvents } from '../../hooks/fabricCanvasHooks/useCanvasMouseEvents';
import { useDrawFabricCanvas } from '../../CanvasDraw';
import { useEditFabricCanvas } from '../../hooks/editFabricCanvasHooks/useEditFabricCanvas';
import { useAdjustScrollForCanvasZoom } from '../../hooks/simplebarHooks/useAdjustScrollForCanvasZoom';
import { useCanvasSizeObserver } from '../../hooks/fabricCanvasHooks/useCanvasSizeObserver';
import { useChangeUpperCanvas } from '../../hooks/fabricCanvasHooks/useChangeUpperCanvas';


const Canvas = (): JSX.Element => {
  const { trimModeActive, resizeModeActive } = useSidebarStateContext();

	const InnercontainerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const editCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
	// 様々なイベントを登録するカスタムフック
	const listenerRegistered = useEventRegister();
  // 描画用fabricキャンバスと切り取り領域用fabricキャンバスを初期化するカスタムフック
  const { fabricCanvas, fabricEditCanvas } = useInitializeFabricCanvas(canvasRef, editCanvasRef);
  // キャンバス用のマウスイベントをまとめたカスタムフック
  useCanvasMouseEvents();
	// Rectオブジェクト等をFabricキャンバスに描画するためのカスタムフック
	useDrawFabricCanvas(fabricCanvas);

  // キャンバスのトリミング領域を設定および管理するためのカスタムフック
  useEditFabricCanvas(fabricCanvas, fabricEditCanvas);

	// キャンバスのズーム及び、ズーム後のスクロール(simplebar)の位置を調整するカスタムフック
	useAdjustScrollForCanvasZoom(canvasRef, editCanvasRef, InnercontainerRef);
	// drawing-canvasのサイズが変更された際、Innercontainerのサイズも変更するカスタムフック
	useCanvasSizeObserver(canvasRef, InnercontainerRef);
  // drawing-canvasとedit-canvasにあるupper-canvasのscaleとdrawing-canvasのopacityを変更するカスタムフック
	useChangeUpperCanvas(listenerRegistered);
  

	console.log("render Canvas")

	return (
    <div id="inner-canvas-container" ref={InnercontainerRef}>
      <canvas 
        id="drawing-canvas"
        ref={canvasRef}
        width="800"
        height="600"
        style={{ zIndex: 1, opacity: listenerRegistered ? '1' : '0'}} 
      />
      <canvas 
        id="edit-canvas"
        ref={editCanvasRef}
        style={{ zIndex: trimModeActive || resizeModeActive ? 10 : -1 }}
      />
    </div>
	);
}

export default Canvas;
