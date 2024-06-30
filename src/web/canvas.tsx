import { useRef } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import SimpleBarCore from 'simplebar-core';
import { useChangeScaleUpperCanvases } from './hooks/useChangeScaleUpperCanvases';
import { useSimpleBarHoverCleanup } from './hooks/useSimpleBarHoverCleanup';
import { useAdjustScrollForCanvasZoom } from './hooks/useAdjustScrollForCanvasZoom';
import { useSidebarStateContext } from './components/SideBar/SidebarStateContext';
import { useDrawFabricCanvas } from './CanvasDraw';
import { useCanvasSizeObserver } from './hooks/fabricCanvasHooks/useCanvasSizeObserver';
import { useInitializeSimpleBar } from './hooks/simplebarHooks/useInitializeSimpleBar';
import { useEventRegister } from './hooks/fabricCanvasHooks/useEventRegister';
import { useCanvasMouseEvents } from './hooks/fabricCanvasHooks/useCanvasMouseEvents';

const CanvasComponent = (): JSX.Element  => {
	const { trimModeActive, resizeModeActive } = useSidebarStateContext();
	
	const simpleBarRef = useRef<SimpleBarCore | null>(null);
	const InnercontainerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const editCanvasRef = useRef<HTMLCanvasElement | null>(null);
	
	// カスタムフックを使用

	useInitializeSimpleBar(simpleBarRef);
	const listenerRegistered = useEventRegister();
	useCanvasMouseEvents();
	// Rectオブジェクト等をFabricキャンバスに描画するためのカスタムフック
	useDrawFabricCanvas(canvasRef, editCanvasRef);
	useChangeScaleUpperCanvases();
	useSimpleBarHoverCleanup();
	// キャンバスのズーム及び、ズーム後のスクロール(simplebar)の位置を調整するカスタムフック
	useAdjustScrollForCanvasZoom(canvasRef, editCanvasRef, InnercontainerRef);
	// drawing-canvasのサイズが変更された際、inner-canvasのサイズも変更するカスタムフック
	useCanvasSizeObserver(canvasRef, InnercontainerRef);

	console.log("render canvas")

	return (
		<div id="outer-canvas-container">
			<div id="trim-overlay" style={{ backgroundColor: trimModeActive ? '#373737' : 'transparent' }}>
				<SimpleBar ref={simpleBarRef} style={{ width: '100%', height: '100%' }}>
					<div id="inner-canvas-container" ref={InnercontainerRef}>
						<canvas id="drawing-canvas" ref={canvasRef} width="800" height="600" style={{ zIndex: 1, opacity: listenerRegistered ? '1' : '0'} } />
						<canvas id="edit-canvas" ref={editCanvasRef} style={{ zIndex: trimModeActive || resizeModeActive ? 10 : -1 }} />
					</div>
				</SimpleBar>
			</div>
		</div>
	);
}

export default CanvasComponent;
